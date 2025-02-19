import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { AddContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, // ✅ Ensure MatTableModule is imported
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  displayedColumns: string[] = [
    'matricule',
    'nom',
    'prenom',
    'telephone_personnel',
    'telephone_professionnel',
    'service',
    'cin',
    'site',
    'action' // ✅ Ensure "action" appears only once
  ];
  
  contacts: any[] = [];

  constructor(private contactService: ContactService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {
    this.contactService.getContacts().subscribe(
      (response: any) => {
        console.log('API Response:', response); // Debugging API response
  
        if (Array.isArray(response)) {
          // ✅ If response is already an array, assign it directly
          this.contacts = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          // ✅ If response has { status, data }, extract `data`
          this.contacts = response.data;
        } else {
          console.warn('Unexpected API response format:', response);
          this.contacts = [];
        }
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        this.contacts = [];
      }
    );
  }
  

  openAddContactModal() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(newContact => {
      if (newContact) {
        this.fetchContacts();
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
        this.fetchContacts();
      }
    });
  }

  deleteContact(matricule: string) {
    this.contacts = this.contacts.filter(contact => contact.matricule !== matricule);
  }
}
