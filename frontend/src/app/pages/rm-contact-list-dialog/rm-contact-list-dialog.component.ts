import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-remove-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatIconModule],
  templateUrl: './rm-contact-list-dialog.component.html',
  styleUrls: ['./rm-contact-list-dialog.component.scss']
})
export class RemoveContactDialogComponent {
  searchTerm: string = '';
  filteredContacts: any[];

  constructor(
    public dialogRef: MatDialogRef<RemoveContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contacts: any[] }
  ) {
    this.filteredContacts = this.data.contacts;
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.data.contacts.filter(contact =>
      contact.nom.toLowerCase().includes(term)
    );
  }

  removeContacts() {
    const selectedContacts = this.data.contacts
      .filter(contact => contact.selected)
      .map(contact => contact.id);
    this.dialogRef.close(selectedContacts);
  }
}
