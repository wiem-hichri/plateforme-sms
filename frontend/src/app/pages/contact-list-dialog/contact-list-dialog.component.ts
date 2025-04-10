import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contact-list-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCheckboxModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './contact-list-dialog.component.html',
  styleUrls: ['./contact-list-dialog.component.scss']
})
export class ContactListDialogComponent {
  contacts: any[] = [];
  filteredContacts: any[] = [];
  searchTerm: string = '';
  action: 'add' | 'remove';

  constructor(
    public dialogRef: MatDialogRef<ContactListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contacts: any[], groupId: number, action: 'add' | 'remove' }
  ) {
    this.contacts = data.contacts;
    this.action = data.action;

    // Pre-select contacts if it's "remove"
    if (this.action === 'remove') {
      this.contacts = this.contacts.map(c => ({ ...c, selected: true }));
    }

    this.filteredContacts = this.getFilteredContacts();
  }

  getFilteredContacts(): any[] {
    const term = this.searchTerm.toLowerCase();
    let contactsToFilter = this.action === 'remove'
      ? this.contacts.filter(c => c.selected)
      : this.contacts;

    return contactsToFilter.filter(contact =>
      contact.nom.toLowerCase().includes(term) ||
      (contact.site && contact.site.toLowerCase().includes(term))
    );
  }

  onSearchChange(): void {
    this.filteredContacts = this.getFilteredContacts();
  }

  confirmSelection() {
    const selectedContacts = this.contacts
      .filter(contact => contact.selected)
      .map(contact => contact.id);

    this.dialogRef.close(selectedContacts);
  }
}
