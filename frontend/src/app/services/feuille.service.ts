import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class FeuilleService {
    private apiUrl = 'http://localhost:8080/api/feuilles'; // À adapter selon ton backend

    constructor(private http: HttpClient) { }

    getFeuillesEnAttente(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/attente`);
    }

    validerFeuille(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/valider`, {});
    }

    rejeterFeuille(id: number, remarque: string) {
        return this.http.post(`${this.apiUrl}/${id}/rejeter`, { remarque });
    }
    getApprobateurs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/approbateurs`);
    }
}
