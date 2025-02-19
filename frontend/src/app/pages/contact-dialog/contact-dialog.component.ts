import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service'; // ✅ Import service

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

  constructor(
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    private contactService: ContactService // ✅ Inject ContactService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addContact() {
    if (this.newContact.matricule && this.newContact.nom) {
      this.contactService.addContact(this.newContact).subscribe(
        (response) => {
          console.log('Contact added successfully:', response);
          this.dialogRef.close(this.newContact); // ✅ Close dialog & refresh
        },
        (error) => {
          console.error('Error adding contact:', error);
        }
      );
    }
  }
}
