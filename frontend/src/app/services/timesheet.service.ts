import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Timesheet {
  id: number;
  employeeId: number;
  periodStart: Date;
  periodEnd: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  totalHours: number;
  entries: TimesheetEntry[];
}

export interface TimesheetEntry {
  id: number;
  date: Date;
  projectId: number;
  hours: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private apiUrl = `${environment.apiURL}/timesheets`;

  constructor(private http: HttpClient) { }

  // Get all timesheets
  getTimesheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(this.apiUrl);
  }

  // Get timesheets for a specific employee
  getEmployeeTimesheets(employeeId: number): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  // Get a single timesheet by ID
  getTimesheet(id: number): Observable<Timesheet> {
    return this.http.get<Timesheet>(`${this.apiUrl}/${id}`);
  }

  // Submit a new timesheet
  createTimesheet(timesheet: Omit<Timesheet, 'id' | 'status'>): Observable<Timesheet> {
    return this.http.post<Timesheet>(this.apiUrl, timesheet);
  }

  // Update an existing timesheet
  updateTimesheet(id: number, timesheet: Partial<Timesheet>): Observable<Timesheet> {
    return this.http.put<Timesheet>(`${this.apiUrl}/${id}`, timesheet);
  }

  // Approve a timesheet
  approveTimesheet(id: number): Observable<Timesheet> {
    return this.http.put<Timesheet>(`${this.apiUrl}/${id}/approve`, {});
  }

  // Reject a timesheet
  rejectTimesheet(id: number, reason: string): Observable<Timesheet> {
    return this.http.put<Timesheet>(`${this.apiUrl}/${id}/reject`, { rejectionReason: reason });
  }

  // Get timesheets by status
  getTimesheetsByStatus(status: string): Observable<Timesheet[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Timesheet[]>(this.apiUrl, { params });
  }

  // Get timesheets within a date range
  getTimesheetsByDateRange(startDate: string, endDate: string): Observable<Timesheet[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Timesheet[]>(this.apiUrl, { params });
  }
}