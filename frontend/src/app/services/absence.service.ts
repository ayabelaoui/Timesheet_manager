import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Absence } from '../models/absence.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  private apiUrl = `${environment.apiURL}/absences`;

  constructor(private http: HttpClient) { }

  getAllAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(this.apiUrl);
  }

  getAbsenceById(id: number): Observable<Absence> {
    return this.http.get<Absence>(`${this.apiUrl}/${id}`);
  }

  createAbsence(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(this.apiUrl, absence);
  }

  updateAbsence(id: number, absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(`${this.apiUrl}/${id}`, absence);
  }

  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserAbsences(userId: number): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${this.apiUrl}/user/${userId}`);
  }
}