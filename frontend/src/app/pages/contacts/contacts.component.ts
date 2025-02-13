import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'telephone', 'action'];

  contacts = [
    { id: 1, nom: 'Ali', prenom: 'BenAli', telephone: '55362987' },
    { id: 2, nom: 'Ahmed', prenom: 'BenAhmed', telephone: '52895632' },
    { id: 3, nom: 'Mohamed', prenom: 'BenMohamed', telephone: '20365987' }
  ];

 
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // TODO: Process the Excel file and update contacts
    }
  }

  openAddContactDialog() {
    alert('Add Contact Form Coming Soon!');
  }

  deleteContact(contact: any) {
    this.contacts = this.contacts.filter(c => c.id !== contact.id);
  }

  editContact(contact: any) {
    alert('Editing contact: ' + contact.nom);
  }
}
