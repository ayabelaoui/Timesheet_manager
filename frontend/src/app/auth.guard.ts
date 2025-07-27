import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Chemin à adapter si nécessaire
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root' // Fournit automatiquement ce guard dans toute l'application
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.isAuthenticated$.pipe(
            take(1), // Prend une seule valeur et complète l'observable
            map(isAuthenticated => {
                console.log('AuthGuard - isAuthenticated:', isAuthenticated); // Debug

                if (isAuthenticated) {
                    return true; // Accès autorisé
                } else {
                    // Redirection vers login si l'utilisateur n'est pas connecté
                    this.router.navigate(['/login'], {
                        queryParams: { returnUrl: state.url }
                    });
                    return false;
                }
            })
        );
    }
}
