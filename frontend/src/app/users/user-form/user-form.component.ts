import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { RoleEnum } from '../../models/role.model';

@Component({
  standalone:false,
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  roles: Role[] = [];
  supervisors: User[] = [];
  isEdit = false;
  roleEnum = RoleEnum;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.loadSupervisors();

    if (this.isEdit && this.data.user) {
      this.patchForm(this.data.user);
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? null : Validators.required],
      address: [''],
      phone: [''],
      socialInsuranceNumber: [''],
      hireDate: ['', Validators.required],
      supervisor: [null],
      hourlyRate: [''],
      roles: [[], Validators.required]
    });
  }

  patchForm(user: User): void {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      socialInsuranceNumber: user.socialInsuranceNumber,
      hireDate: user.hireDate,
      supervisor: user.supervisor,
      hourlyRate: user.hourlyRate,
      roles: user.roles.map(role => role.id)
    });

    if (this.isEdit && this.userForm && this.userForm.get('password')) {
      this.userForm?.get('password')?.clearValidators();
      this.userForm?.get('password')?.updateValueAndValidity();
    }
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  loadSupervisors(): void {
    this.userService.getSupervisors().subscribe(supervisors => {
      this.supervisors = supervisors;
    });
  }

  compareRoles(role1: Role, role2: Role): boolean {
    return role1 && role2 ? role1.id === role2.id : role1 === role2;
  }

  compareUsers(user1: User, user2: User): boolean {
    return user1 && user2 ? user1.id === user2.id : user1 === user2;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.isEdit) {
        this.userService.updateUser(this.data.user.id, userData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.userService.createUser(userData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}