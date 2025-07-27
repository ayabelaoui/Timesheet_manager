import { Role } from './role.model';

// src/app/models/user.model.ts
export interface User {
    id?: number;
    email: string;
    password?: string;   // optionnel, généralement pas envoyé au frontend
    name?: string;
    address?: string;
    phone?: string;
    socialInsuranceNumber?: string;
    hireDate: Date;
    supervisor?: User;
    hourlyRate?: number;
    roles: Role[];
    subordinates?: User[];
    token?: string;
}



export function canEditDate(user: User, date: Date): boolean {
  const hireDate = new Date(user.hireDate);
  return date >= hireDate && date <= new Date();
}
