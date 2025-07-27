import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';
//import { RoleEnum } from '../../models/role.model';

@Component({
  standalone:false,
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  //roleEnum = RoleEnum;

  constructor(@Inject(MAT_DIALOG_DATA) public user: User) { }

  getRoleNames(roles: any[]): string {
    return roles.map(role => role.name.replace('ROLE_', '')).join(', ');
  }

  getSupervisorName(): string {
    return this.user.supervisor ? this.user.supervisor.name ??  'None': 'None';
  }
}