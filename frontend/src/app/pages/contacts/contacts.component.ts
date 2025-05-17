import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { AddContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    'cin',
    'site',
    'fonction',
    'action'
  ];

  dataSource = new MatTableDataSource<Contact>();
  filterValue: string = '';

  constructor(private contactService: ContactService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {
    this.contactService.getContacts().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.dataSource.data = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.dataSource.data = response.data;
        } else {
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
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
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
          this.dataSource._updateChangeSubscription();
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

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contacts');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, 'Contacts.xlsx');
  }

  importExcel(event: any) {
    console.log('Import Excel function called', event);
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
      alert("Please upload a single Excel file.");
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const binaryString: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        const contacts: Contact[] = XLSX.utils.sheet_to_json(sheet);
        console.log('Parsed contacts:', contacts);

        if (contacts && contacts.length > 0) {
          this.contactService.addMultipleContacts(contacts).subscribe(
            (res) => {
              console.log('Import response:', res);
              alert(`${res.importedCount || contacts.length} contacts imported successfully!`);
              this.fetchContacts(); // Refresh the contacts list
            },
            (err) => {
              console.error('Error importing contacts:', err);
              alert('Error importing contacts: ' + (err.message || 'Unknown error'));
            }
          );
        } else {
          alert('No contacts found in the Excel file.');
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Error processing Excel file: ');
      }
    };

    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      alert('Error reading file');
    };

    reader.readAsBinaryString(target.files[0]);
  }
}