import { Injectable } from '@angular/core';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {

  static isBefore(date: Date, compareTo: Date): boolean {
    return date < compareTo;
  }

  static isAfter(date: Date, compareTo: Date): boolean {
    console.log("isAfter::" , date > compareTo)
    return date > compareTo;
  }

  static toMonthString(date: Date): string {
    return format(date, 'yyyy-MM');
  }

  static toDateString(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
  
  static toDate(dateString: string): Date {
    return new Date(dateString);
  }
}
