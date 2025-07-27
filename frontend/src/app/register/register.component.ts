import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorDisplayComponent } from '../error-display/error-display.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ErrorDisplayComponent, RouterLink]
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup;
    errors: { [key: string]: string } | null = null;
    isLoading = false;

    constructor() {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
            ]],
            name: ['', Validators.required],
            role: ['ROLE_USER'],
            address: [''],
            phone: ['', [Validators.pattern(/^[0-9]+$/)]]
        });
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            this.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errors = null;

        this.authService.register(this.registerForm.value).subscribe({
            next: () => {
                this.router.navigate(['/login'], {
                    queryParams: { registered: 'true' }
                });
            },
            error: (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.handleError(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    private markAllAsTouched() {
        Object.values(this.registerForm.controls).forEach(control => {
            control.markAsTouched();
        });
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 400 && error.error?.errors) {
            this.errors = error.error.errors;
        } else if (error.status === 409) {
            this.errors = { email: 'This email is already registered' };
        } else {
            this.errors = { general: 'Registration failed. Please try again.' };
        }
    }

    get email() { return this.registerForm.get('email'); }
    get password() { return this.registerForm.get('password'); }
    get name() { return this.registerForm.get('name'); }
    get phone() { return this.registerForm.get('phone'); }
}