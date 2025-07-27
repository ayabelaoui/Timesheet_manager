//import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoraireComponent } from '../composants/horaire.component';
import { FormsModule } from '@angular/forms';  // Ajouter FormsModule pour ngModel


//@NgModule({
//  declarations: [HoraireComponent],  // Déclare ton composant ici
// imports: [CommonModule],  // N'oublie pas d'importer CommonModule pour utiliser des directives comme *ngIf, *ngFor
//})
export class Horaire {
    id: number;
    date: string; // Date au format string, ex: "2025-05-24"
    heuresTravaillees: number;

    constructor(id: number, date: string, heuresTravaillees: number) {
        this.id = id;
        this.date = date;
        this.heuresTravaillees = heuresTravaillees;
    }
}
