import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthenticated$.subscribe(
      (loggedIn) => this.isLoggedIn = loggedIn
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}