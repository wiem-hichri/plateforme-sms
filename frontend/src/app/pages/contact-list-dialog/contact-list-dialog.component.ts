import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatIconModule],
  templateUrl: './contact-list-dialog.component.html',
  styleUrls: ['./contact-list-dialog.component.scss']
})
export class AddContactDialogComponent {
  searchTerm: string = '';
  filteredContacts: any[];

  constructor(
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contacts: any[] }
  ) {
    this.filteredContacts = this.data.contacts;
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.data.contacts.filter(contact =>
      (contact.nom && contact.nom.toLowerCase().includes(term)) ||
      (contact.prenom && contact.prenom.toLowerCase().includes(term)) ||
      (contact.matricule && contact.matricule.toLowerCase().includes(term)) ||
      (contact.site && contact.site.toLowerCase().includes(term)) ||
      (contact.fonction && contact.fonction.toLowerCase().includes(term))
    );
  }
  

  addContacts() {
    const selectedContacts = this.data.contacts
      .filter(contact => contact.selected)
      .map(contact => contact.id);
    this.dialogRef.close(selectedContacts);
  }
}
