import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Chemin corrigé
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // Ajout du style
})
export class HeaderComponent {
  currentUrl!: string;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  shouldShowTimesheetLink(): boolean {
    return this.authService.isAuthenticated() || this.currentUrl === '/timesheet';
  }
}
