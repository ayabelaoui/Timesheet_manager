import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    constructor() { }

    handleError(error: any): void {
        console.error('Erreur détectée :', error);
        // Tu peux ajouter d’autres traitements ici si besoin
    }
}
