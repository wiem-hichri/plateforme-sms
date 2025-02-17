import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupsDialogComponent } from '../add-groups-dialog/add-groups-dialog.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent {
  displayedColumns: string[] = [ 'nom', 'action'];

  groups = [
    { nom: 'Transport' },
    { nom: 'Transporteurs Internes' },
    { nom: 'Transporteurs Externes' },
    { nom: 'Logistique' }
  ];

   constructor(public dialog: MatDialog) {}
  
    openAddGroupsModal() {
      const dialogRef = this.dialog.open(AddGroupsDialogComponent, {
        width: '400px'
      });
  
      dialogRef.afterClosed().subscribe(newGroup => {
        if (newGroup) {
          this.groups.push(newGroup);
        }
      });
    }
  
}
