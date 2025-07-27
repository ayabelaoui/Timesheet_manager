import { Component, inject } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorDisplayComponent } from '../error-display/error-display.component';
import { ALL_ROLES, ROLE_ADMIN, ROLE_APPROBATEUR, ROLE_USER } from '../models/role.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ErrorDisplayComponent
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errors: Record<string, string> | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errors = null;

    const { email, password } = this.loginForm.value;
    const credentials = { email, password };

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        const currentUser =  { name: '', hireDate: '',role: '' };
        
        //JSON.stringify(user);parse
        if (this.authService.hasRole(ROLE_APPROBATEUR)) {
          currentUser.role = 'ROLE_APPROBATEUR' ;
          this.router.navigate(['/dashboard-approbateur']);
        } else if (this.authService.hasRole(ROLE_USER)) {
          currentUser.role = 'ROLE_USER' ;
          this.router.navigate(['/dashboard-employe']);
        } else if (this.authService.hasRole(ROLE_ADMIN)){
          currentUser.role = ROLE_ADMIN ;
          this.router.navigate(['/users']); // fallback
        }
        else{
          currentUser.role = ROLE_ADMIN ;
          this.router.navigate(['/timesheet']); // fallback
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      },
      error: (error) => {
        this.isLoading = false;
        this.handleLoginError(error);
        alert('Veuillez entrer votre email et mot de passe.');
      }
    });
  }

  private handleLoginError(error: any) {
    if (error.status === 401) {
      this.errors = { general: 'Email ou mot de passe invalide' };
    } else if (error.error && typeof error.error === 'object') {
      this.errors = error.error;
    } else {
      this.errors = { general: 'Échec de la connexion. Veuillez réessayer.' };
    }
  }
}
