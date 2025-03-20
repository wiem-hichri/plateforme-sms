import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-history.component.html',
  styleUrl: './login-history.component.scss'
})
export class LoginHistoryComponent implements OnInit {
  loginHistory: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/login-history').subscribe({
      next: (data) => (this.loginHistory = data),
      error: (err) => console.error("Erreur lors du chargement de l'historique des connexions:", err),
    });
  }
}