import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class AddContactDialogComponent implements OnInit {
  newContact = {
    matricule: '',
    nom: '',
    prenom: '',
    telephone_personnel: '',
    telephone_professionnel: '',
    cin: '',
    site: '',
  };

  constructor(
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {}

  addContact() {
    if (this.newContact.matricule && this.newContact.nom) {
      this.contactService.addContact(this.newContact).subscribe(
        () => {
          console.log('Contact added successfully.');
          this.dialogRef.close(this.newContact);
        },
        (error) => {
          console.error('Error adding contact:', error);
        }
      );
    } else {
      console.error('Missing required contact fields.');
    }
  }
}
