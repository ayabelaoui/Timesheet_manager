/**
analyse the current TimesheetComponent class and make the changes needed to respond the missing behaviors below :

 need to handle 3 profiles :
1- Employee Profile:
The timesheet calendar will be selected by month and
begins with the month of the first day of recruitment.
If the month entry is validated by the HR profile, the fields must be grayed out and the buttons hidden.
If the month entry is validated by the employee profile, the fields must be grayed out and the buttons hidden.
Otherwise, the default status is: draft. All fields are editable and accept an integer, 0, and 24 hours.
The day table ranges from 1 to 30 or 31 or 28 or 29 depending on the month.
Weekend (Saturday-Sunday): colored beige.
- Public holiday: colored but editable (regardless of color).
- Validated vacation day: colored gray.
- Past month's day: gray.
Future day: gray.
Action buttons:
Save: does not change status.
Validate: changes to the "ValidateEmployee" status.

2- HR Profile:
Selection by month. Displays all monthly records with the status "Validate Employee" or "Validate HR."
Sorted alphabetically.
Once an employee is selected; -if status = "employee validated"
All fields are read-only, with coloring for the leave and public holidays of the employee who owns the record.
2 buttons:
Approve: Change to "HR validated" status
Reject:
- mandatory comment entry in a pop-up, which is sent by email
- Change to "draft" status
3- Admin profile : have just read access to timesheet, and buttons hiden


 */



import { Component, OnInit , AfterViewInit, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HolidayService } from '../services/holiday.service';
import { DateUtils } from '../utils/date.utils';
import { TimesheetService } from '../services/timesheet.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class TimesheetComponent implements OnInit,AfterViewInit {
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  months = [
    { name: 'January', days: 31 },
    { name: 'February', days: 28 },
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 }
  ];

  currentYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  weeks: { dates: (number | null)[], hours: (number | null)[] }[] = [];

  hours: { [key: number]: number } = {};
  remarks: string = '';
  timesheetStatus: string = 'Draft';
  drafts: any[] = [];

  currentUser = { name: '', hireDate: '',role: '' };
  userRole: string = 'ROLE_USER';
  holidays: Date[] = [];
  year = 2025;
  countryCode = 'MA'; // Morocco

  constructor(private router: Router,private holidayService: HolidayService,private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.loadHolidays();
    
  }

   loadHolidays() {
    this.holidayService.getHolidays(this.year, this.countryCode).subscribe({
      next: (holidays) => {
        this.holidays = holidays;
        console.log('holidays',holidays);
      },
      error: (err) => {
        console.error('Failed to load holidays', err);
      }
    });
  }

  isHoliday(day: number): boolean {
    const date = new Date(this.currentYear, this.selectedMonth, day);
    return this.holidays.some(holiday => 
      holiday.getDate() === date.getDate() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getFullYear() === date.getFullYear()
    );
  }
  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.loadUserData();
      this.userRole = this.currentUser.role;
      
      this.loadHoursFromLocalStorage();
      this.updateCalendar();
      this.loadDrafts();
    }
  }
  
  loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    console.log("hireDate:: ",this.currentUser.hireDate);
  }

  loadHoursFromLocalStorage() {
    const key = `hours_${this.currentUser.name}_${this.currentYear}_${this.selectedMonth}`;
    const savedHours = localStorage.getItem(key);
    this.hours = savedHours ? JSON.parse(savedHours) : {};
  }

  saveHoursToLocalStorage() {
    const key = `hours_${this.currentUser.name}_${this.currentYear}_${this.selectedMonth}`;
    localStorage.setItem(key, JSON.stringify(this.hours));
  }

  updateCalendar() {
    this.loadHolidays();
    this.weeks = [];
    const daysInMonth = this.months[this.selectedMonth].days;
    let currentWeekDates: (number | null)[] = Array(7).fill(null);
    let currentWeekHours: (number | null)[] = Array(7).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.selectedMonth, day);

      // if (DateUtils.isBefore(date,DateUtils.toDate(this.currentUser.hireDate))) continue;
      const dayOfWeek = (date.getDay() + 6) % 7;

      currentWeekDates[dayOfWeek] = day;
      if (this.hours[day] === undefined || this.hours[day] === null) {
        this.hours[day] = 0;
      }
      currentWeekHours[dayOfWeek] = this.hours[day] || 0;

      if (dayOfWeek === 6 || day === daysInMonth) {
        this.weeks.push({
          dates: [...currentWeekDates],
          hours: [...currentWeekHours]
        });
        currentWeekDates = Array(7).fill(null);
        currentWeekHours = Array(7).fill(null);
      }
    }
  }

  // Calculate valid months for employee
  get minDate(): string { 
     const date = new Date(this.currentYear, this.selectedMonth, 1);
      date.setHours(0, 0, 0, 0); // Normalize to start of day
    return DateUtils.toDateString(new Date());
  }

  get maxDate(): string {
     const date = new Date(this.currentYear, this.selectedMonth, 20);
      date.setHours(23, 59, 59, 999); // Normalize to end of day
    return DateUtils.toMonthString(new Date());
  }

  // Handle date comparisons
  isPastDay(dayDate: string): boolean {
    const date = DateUtils.toDate(dayDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    return DateUtils.isBefore(date, today);
  }

  isFutureDay(dayDate: string): boolean {
    const date = DateUtils.toDate(dayDate);
    const today = new Date();
    //today.setHours(0, 0, 0, 0); // Normalize to start of day
    today.setHours(23, 59, 59, 999); // Normalize to end of day
   // console.log("isFutureDay::",DateUtils.isAfter(date, today),date,today);
    return DateUtils.isAfter(date, today);
  }

  isValidDate(day: number): boolean {
    if(day <= 0 || day > this.months[this.selectedMonth].days) return false;
    const date = new Date(this.currentYear, this.selectedMonth, day);
    const dayDate = DateUtils.toDateString(date);
    console.log("isValidDate::",!this.isFutureDay(dayDate),day,dayDate,this.isFutureDay(dayDate));
    return dayDate !== null 
      && !DateUtils.isBefore(date,DateUtils.toDate(this.currentUser.hireDate))
        && !this.isFutureDay(dayDate)
        && !this.isHoliday(DateUtils.toDate(dayDate).getDate());
  }

  get isTimesheetStatusDraft() : boolean {
    return this.timesheetStatus === 'Draft';
  }

  
  get isTimesheetStatusApproved() : boolean {
    return this.timesheetStatus === 'HRValidated';
  }

get isCurrentMonth(): boolean {
  const today = new Date();
  return today.getFullYear() === this.currentYear && today.getMonth() === this.selectedMonth;

}


  isToBeDisabled(day: number): boolean {
    console.log("isToBeDisabled::",this.currentUser.role,!this.isUser,!this.isValidDate(day), this.timesheetStatus !== 'Draft',!this.isCurrentMonth );
    return !this.isUser ||  !this.isValidDate(day) || this.timesheetStatus !== 'Draft' || !this.isCurrentMonth ;
  }

  getMonthName(): string {
    return this.months[this.selectedMonth].name;
  }

  getTotalHours(): number {
    return Object.values(this.hours).reduce((acc, val) => acc + (val || 0), 0);
  }

  getDraftTotal(hours: any): number {
    return Object.values(hours).reduce((total: number, h: any) => {
      return total + (Number(h) || 0);
    }, 0);
  }

  saveDraft() {
    const draft = {
      month: this.selectedMonth,
      year: this.currentYear,
      hours: { ...this.hours },
      savedAt: new Date(),
      savedBy: this.currentUser.name
    };

    // Find index of existing draft with same month/year
    const existingIndex = this.drafts.findIndex(
      d => d.month === draft.month && d.year === draft.year
    );

    if (existingIndex !== -1) {
      // Update existing draft
      this.drafts[existingIndex] = draft;
    } else {
      // Add new draft
      this.drafts.push(draft);
    }

    // Save to localStorage
    localStorage.setItem('timesheetDrafts', JSON.stringify(this.drafts));
    alert(`Draft for ${this.getMonthName()} saved!`);
    this.timesheetStatus = 'Draft';
  }

  loadDrafts() {
    const savedDrafts = localStorage.getItem('timesheetDrafts');
    this.drafts = savedDrafts ? JSON.parse(savedDrafts) : [];
  }

  get isAdmin(): boolean {
    return this.currentUser.role === 'ROLE_ADMIN';
  }
  get isApprobateur(): boolean {
    return this.currentUser.role === 'ROLE_APPROBATEUR';
  }
  get isUser(): boolean {
    return this.currentUser.role === 'ROLE_USER';
  }

  previousMonth() {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.currentYear--;
    } else {
      this.selectedMonth--;
    }
    this.loadHoursFromLocalStorage();
    this.updateCalendar();
  }

  nextMonth() {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.currentYear++;
    } else {
      this.selectedMonth++;
    }
    this.loadHoursFromLocalStorage();
    this.updateCalendar();
  }

  switchRole() {
    this.currentUser.role = this.currentUser.role === 'ROLE_USER' ? 'ROLE_ADMIN' : this.currentUser.role === 'ROLE_ADMIN' ? 'ROLE_APPROBATEUR' : 'ROLE_USER';
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  saveHours(day: number): void {
    this.saveHoursToLocalStorage();
  }

  submit() {
    this.timesheetStatus = 'EmployeeValidated';
    // Envoie au backend si besoin
    alert('Timesheet EmployeeValidated!');
  }

  approve() {
    this.timesheetStatus = 'HRValidated';
    alert('Timesheet HRValidated!');
  }

  reject() {
    this.timesheetStatus = 'Rejected';
    alert('Timesheet rejected.');
  }
}
