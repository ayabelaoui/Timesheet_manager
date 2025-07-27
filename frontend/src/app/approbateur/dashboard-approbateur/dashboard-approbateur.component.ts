import { Component, OnInit } from '@angular/core';
import { FeuilleService } from '../../services/feuille.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-approbateur',
  templateUrl: './dashboard-approbateur.component.html',
  styleUrls: ['./dashboard-approbateur.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DashboardApprobateurComponent implements OnInit {

  feuilles: any[] = [];
  approbateurs: any[] = [];

  constructor(private feuilleService: FeuilleService) { }

  ngOnInit(): void {
    this.chargerFeuilles();
    this.chargerApprobateurs();
  }

  chargerFeuilles(): void {
    this.feuilleService.getFeuillesEnAttente().subscribe((data: any[]) => {
      this.feuilles = data;
    });
  }

  chargerApprobateurs(): void {
    this.feuilleService.getApprobateurs().subscribe((data: any[]) => {
      this.approbateurs = data;
    });
  }

  valider(id: number): void {
    this.feuilleService.validerFeuille(id).subscribe(() => {
      this.chargerFeuilles();
    });
  }

  rejeter(id: number, remarque: string): void {
    this.feuilleService.rejeterFeuille(id, remarque).subscribe(() => {
      this.chargerFeuilles();
    });
  }
}
