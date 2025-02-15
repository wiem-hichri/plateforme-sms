import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent {
  displayedColumns: string[] = ['id', 'nom', 'action'];

  groups = [
    { id: 2, nom: 'Transport' },
    { id: 3, nom: 'Transporteurs Internes' },
    { id: 4, nom: 'Transporteurs Externes' },
    { id: 6, nom: 'Logistique' }
  ];
}
