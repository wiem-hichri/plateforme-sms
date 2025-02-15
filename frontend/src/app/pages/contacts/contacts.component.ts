import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  displayedColumns: string[] = ['matricule', 'nom', 'prenom', 'telephone_personnel', 'telephone_professionnel', 'service', 'cin', 'site', 'action'];

  contacts = [
    { matricule: 'A123', nom: 'Ali', prenom: 'Ben Ali', telephone_personnel: '55362987', telephone_professionnel: '70123456', service: 'IT', cin: '12345678', site: 'Tunis' },
    { matricule: 'B456', nom: 'Ahmed', prenom: 'Ben Ahmed', telephone_personnel: '52895632', telephone_professionnel: '71234567', service: 'Finance', cin: '87654321', site: 'Sfax' },
    { matricule: 'C789', nom: 'Mohamed', prenom: 'Ben Mohamed', telephone_personnel: '20365987', telephone_professionnel: '72234567', service: 'HR', cin: '11223344', site: 'Sousse' }
  ];


  constructor(public dialog: MatDialog) {}

  openAddContactModal() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(newContact => {
      if (newContact) {
        this.contacts.push(newContact);
      }
    });
  }

  editContact(contact: any) {
    const dialogRef = this.dialog.open(EditContactDialogComponent, {
      width: '400px',
      data: { contact }
    });

    dialogRef.afterClosed().subscribe(updatedContact => {
      if (updatedContact) {
        const index = this.contacts.findIndex(c => c.matricule === updatedContact.matricule);
        if (index !== -1) {
          this.contacts[index] = updatedContact; // Update the contact in the list
        }
      }
    });
  }

  deleteContact(matricule: string) {
    this.contacts = this.contacts.filter(contact => contact.matricule !== matricule);
  }
}
