import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { User } from '../../models/user.model';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Role } from '../../models/role.model';

@Component({
  standalone:false,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'roles', 'hireDate', 'actions'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDetails(user: User): void {
    this.dialog.open(UserDetailsComponent, {
      width: '600px',
      data: user
    });
  }

  createNewUser(): User {
  return {
    email: '',
    name: '',
    address: '',
    phone: '',
    socialInsuranceNumber: '',
    hireDate: new Date(),
    supervisor: undefined,
    hourlyRate: undefined,
    roles: [],
    subordinates: []
  };
}

  openEditForm(user: User | null): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { user, isEdit: user !==null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this user?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).subscribe(() => {
          this.loadUsers();
        });
      }
    });
  }

  getRoleNames(roles: any[]): string {
  
    return roles.map(role => role.name).join(', ');
  }
}