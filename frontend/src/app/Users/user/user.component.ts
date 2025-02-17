import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  users = [
    { matricule: '1234', nom: 'Ali', prenom: 'Ben Salah', email: 'ali@example.com', role: 'Admin' },
    { matricule: '5678', nom: 'Mohamed', prenom: 'Tarek', email: 'mohamed@example.com', role: 'User' },
    { matricule: '9101', nom: 'Sami', prenom: 'Haddad', email: 'sami@example.com', role: 'Manager' },
  ];
}
