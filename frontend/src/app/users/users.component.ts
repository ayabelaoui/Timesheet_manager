
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ConfirmDialogComponent } from './../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  loading = true;
  displayedColumns: string[] = ['name', 'email', 'roles', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openDetailsDialog(user: User): void {
    this.dialog.open(UserDetailsComponent, {
      width: '600px',
      data: user
    });
  }

  deleteUser(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this user?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error deleting user', err)
        });
      }
    });
  }

  getRoleNames(roles: any[]): string {
    return roles.map(role => role.name.replace('ROLE_', '')).join(', ');
  }
}