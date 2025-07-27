import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horaire } from '../models/horaire.model';
import { Feuille } from '../models/feuille.model';

@Injectable({
    providedIn: 'root'
})
export class HoraireService {
    private apiUrl = 'http://localhost:8080/api/horaires'; // URL de l'API backend

    constructor(private http: HttpClient) { }

    // Récupérer les horaires mensuels
    getHorairesMensuels(): Observable<Horaire[]> {
        return this.http.get<Horaire[]>(`${this.apiUrl}/mensuel`);
    }

    // Récupérer la feuille actuelle (corrigé)
    getFeuille(): Observable<Feuille> {
        return this.http.get<Feuille>('http://localhost:8080/api/feuilles/actuelle'); // adapte l'URL à ton backend
    }

    // Sauvegarder un brouillon d'horaires
    saveDraft(horaires: Horaire[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/save-draft`, horaires);
    }

    // Exporter les horaires en PDF
    exportPDF(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export-pdf`, { responseType: 'blob' });
    }

    updateFeuilleDraft(id: number, feuille: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/update-draft/${id}`, feuille);
    }

    submitFeuille(id: number): Observable<any> {
        return this.http.put(`http://localhost:8080/api/feuilles/submit/${id}`, {});
    }

    validerFeuille(id: number): Observable<any> {
        return this.http.post(`http://localhost:8080/api/feuilles/${id}/valider`, {});
    }

    rejeterFeuille(id: number, remarque: string): Observable<any> {
        return this.http.post(`http://localhost:8080/api/feuilles/${id}/rejeter`, { remarque });
    }
}
