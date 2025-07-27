import { User } from './user.model';

export interface Absence {
  id?: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  user?: User;
}