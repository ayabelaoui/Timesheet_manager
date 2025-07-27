// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Get required roles from route data
    const requiredRoles = next.data['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }

    if (this.authService.hasAnyRole(requiredRoles)) {
      return true; // User has required role
    }

    // User doesn't have required role - redirect to unauthorized or login
    this.router.navigate(['/unauthorized']);
    return false;
  }
}