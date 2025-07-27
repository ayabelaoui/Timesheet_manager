import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ApprobateurService {

    private apiUrl = 'http://localhost:8080/api/approbateurs';

    constructor(private http: HttpClient) { }

    getApprobateurs(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }
}
