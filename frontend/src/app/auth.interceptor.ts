import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('REQUEST') private req: any
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request);
  }

  private getToken(): string | null {
    // Browser side
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    
    // Server side (SSR)
    if (this.req?.headers?.cookie) {
      const cookieHeader = this.req.headers.cookie;
      const match = cookieHeader.match(/(?:^|;)\s*token=([^;]*)/);
      return match ? match[1] : null;
    }
    
    return null;
  }
}