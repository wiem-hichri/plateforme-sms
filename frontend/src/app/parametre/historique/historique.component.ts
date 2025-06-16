import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.scss'
})
export class HistoriqueComponent implements OnInit {
  historique: any[] = [];
  filteredHistorique: any[] = [];
  searchText: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ messages: any[] }>('http://localhost:3000/api/historique', {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        this.historique = res.messages;
        this.filteredHistorique = res.messages;
      },
      error: (err) => console.error('Erreur chargement historique:', err)
    });
  }

  filterHistorique() {
    const text = this.searchText.toLowerCase();
    this.filteredHistorique = this.historique.filter(item =>
      item.user_name?.toLowerCase().includes(text) ||
      item.DestinationNumber?.toLowerCase().includes(text) ||
      item.SendingDateTime?.toLowerCase().includes(text) ||
      item.SentBy?.toLowerCase().includes(text)
    );
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredHistorique.map(item => ({
      'Utilisateur': item.user_name,
      'Date d\'envoi': item.SendingDateTime,
      'Destinataire': item.DestinationNumber,
      'Contenu': item.TextDecoded,
      'Statut': item.Status
    })));

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historique');
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `historique_sms_${date}.xlsx`);
  }
}