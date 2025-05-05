import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
}
