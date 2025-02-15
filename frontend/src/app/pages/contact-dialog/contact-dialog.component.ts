import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class AddContactDialogComponent {
  newContact = {
    matricule: '',
    nom: '',
    prenom: '',
    telephone_personnel: '',
    telephone_professionnel: '',
    service: '',
    cin: '', 
    site: ''
  };

  constructor(public dialogRef: MatDialogRef<AddContactDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addContact() {
    if (this.newContact.matricule && this.newContact.nom) {
      this.dialogRef.close(this.newContact);
    }
  }
}
