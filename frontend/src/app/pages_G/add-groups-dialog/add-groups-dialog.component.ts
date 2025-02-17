import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-groups-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-groups-dialog.component.html',
  styleUrl: './add-groups-dialog.component.scss'
})
export class AddGroupsDialogComponent {
  newGroup = {
    nom: '',
  };

  constructor(public dialogRef: MatDialogRef<AddGroupsDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addContact() {
    if ( this.newGroup.nom) {
      this.dialogRef.close(this.newGroup);
    }
  }
}
