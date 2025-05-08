import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.scss'
})
export class HistoriqueComponent implements OnInit {
  historique: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ messages: any[] }>('http://localhost:3000/api/historique', {
      withCredentials: true
    }).subscribe({
      next: (res) => this.historique = res.messages,
      error: (err) => console.error('Erreur chargement historique:', err)
    });
  }

  exportToExcel(): void {
    /* Create a worksheet */
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.historique.map(item => ({
      'Utilisateur': item.user_name,
      'Date d\'envoi': item.SendingDateTime,
      'Destinataire': item.DestinationNumber,
      'Contenu': item.TextDecoded,
      'Statut': item.Status
    })));

    /* Create workbook */
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historique');

    /* Generate Excel file and download */
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `historique_sms_${date}.xlsx`);
  }
}