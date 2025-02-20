import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // ✅ Import MatTableDataSource
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { AddContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
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
    'action'
  ];
  
  dataSource = new MatTableDataSource<Contact>(); // ✅ Use MatTableDataSource
  filterValue: string = ''; // ✅ Holds the filter value

  constructor(private contactService: ContactService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {
    this.contactService.getContacts().subscribe(
      (response: any) => {
        console.log('API Response:', response);

        if (Array.isArray(response)) {
          this.dataSource.data = response; // ✅ Update MatTableDataSource
        } else if (response && response.data && Array.isArray(response.data)) {
          this.dataSource.data = response.data;
        } else {
          console.warn('Unexpected API response format:', response);
          this.dataSource.data = [];
        }
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        this.dataSource.data = [];
      }
    );
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase(); // ✅ Filter table
  }

  openAddContactModal() {
    const dialogRef = this.dialog.open(AddContactDialogComponent, { width: '400px' });
  
    dialogRef.afterClosed().subscribe(newContact => {
      if (newContact) {
        this.fetchContacts();
      }
    });
  }

  editContact(contact: Contact) {
    const dialogRef = this.dialog.open(EditContactDialogComponent, { data: { contact } });
  
    dialogRef.afterClosed().subscribe((updatedContact) => {
      if (updatedContact) {
        const index = this.dataSource.data.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) {
          this.dataSource.data[index] = updatedContact;
          this.dataSource._updateChangeSubscription(); // ✅ Refresh table
        }
      }
    });
  }

  deleteContact(id: number) {
    if (confirm("Are you sure you want to delete this contact?")) {
      this.contactService.deleteContact(id).subscribe(
        () => {
          this.dataSource.data = this.dataSource.data.filter(contact => contact.id !== id);
        },
        (error) => {
          console.error('Error deleting contact:', error);
        }
      );
    }
  }
}
