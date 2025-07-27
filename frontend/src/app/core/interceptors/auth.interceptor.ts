// auth.interceptor.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TokenStorageService } from '../../services/token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private tokenStorage: TokenStorageService,
    private authService: AuthService, private router: Router) {}
private skipUrls = [
    '/api/public/',
    '/api/auth/login',
    '/api/users',
    '/api/health-check'
  ];

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip token for whitelisted URLs
    if (this.skipUrls.some(url => request.url.includes(url))) {
      return next.handle(request);
    }
    const currentUser = this.authService.getCurrentUser();
    const token = currentUser?.token; // Assuming you store a token
    if (isPlatformBrowser(this.platformId)) {
      const token = this.tokenStorage.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.router.navigate(['/unauthorized']);
        }
        return throwError(error);
      })
    );
  }
}