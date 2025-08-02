import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { TokenStorageService } from './token-storage.service';


interface AuthResponse {
  refreshToken(refreshToken: any): unknown;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiURL}/auth`;
  private readonly authTokenKey = 'auth_token';
  private readonly currentUserKey = 'currentUser';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable().pipe(distinctUntilChanged());
  public currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private refreshTokenTimeout: any;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly http: HttpClient,
    private readonly router: Router,
    private tokenStorage: TokenStorageService
  ) {
    this.checkAuthStatus();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private checkAuthStatus(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.loadUserData();
    } else {
      this.clearAuthData();
    }
  }

  private loadUserData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const userData = localStorage.getItem(this.currentUserKey);
    if (userData) {
      try {
        const user = JSON.parse(userData) as User;
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse user data', e);
        this.clearAuthData();
      }
    }
  }

  register(userData: any): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(({ token, user }) => this.setAuthData(token, user)),
      map(response => response.user),
      catchError(this.handleError)
    );
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(({ token, user }) => {
        this.setAuthData(token, user);
       // this.router.navigate(['/timesheet']);
      }),
      map(response => {
        // Store token and user info
        this.tokenStorage.saveToken(response.token);
       // this.tokenStorage.saveRefreshToken(response.refreshToken);
        this.tokenStorage.saveUser(response.user);
        this.currentUserSubject.next(response.user);
     //   this.startRefreshTokenTimer();
        this.currentUserSubject.next(response.user);
        return response.user;
      }),
      catchError(this.handleError)
    );
  }

  private startRefreshTokenTimer(): void {
  const token = this.tokenStorage.getToken();

  if (!token) {
    console.warn('No token available to start refresh timer');
    return;
  }

  try {
    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiration

    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
  }
}


private stopRefreshTokenTimer(): void {
  clearTimeout(this.refreshTokenTimeout);
}

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap(({ token }) => this.setAuthToken(token)),
      map(response => response.token),
      catchError(error => {
        this.clearAuthData();
        return this.handleError(error);
      })
    );
  }

  private setAuthData(token: string, user: User): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(this.authTokenKey, token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
  }

  private setAuthToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(this.authTokenKey, token);
    this.isAuthenticatedSubject.next(true);
    this.loadUserData();
  }

  private clearAuthData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.currentUserKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.authTokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(requiredRole:  string): boolean {
    const user = this.currentUserSubject.value;
   return !!user?.roles?.some(role => role.name === requiredRole);
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return !!user?.roles?.some(role => requiredRoles.includes(role.name));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.statusText;
      if (error.status === 401) {
        this.clearAuthData();
      }
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors
    }));
  }

}
