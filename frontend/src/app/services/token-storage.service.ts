// token-storage.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

    
    private readonly TOKEN_KEY = 'auth-token';
    private readonly USER_KEY = 'auth-user';
    private readonly REFRESH_TOKEN_KEY = 'auth-refresh-token';

   constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  saveRefreshToken(refreshToken: any) {
     window.sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }
  

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    window.sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(this.USER_KEY);
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
   getRefreshToken(): string | null {
    return window.sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

}