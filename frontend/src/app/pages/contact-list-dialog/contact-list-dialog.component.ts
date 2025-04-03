import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-contact-list-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  templateUrl: './contact-list-dialog.component.html',
  styleUrls: ['./contact-list-dialog.component.scss']
})
export class ContactListDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ContactListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contacts: any[], groupId: number, action: string }
  ) {}

  confirmSelection() {
    const selectedContacts = this.data.contacts
      .filter(contact => contact.selected)
      .map(contact => contact.id);
    this.dialogRef.close(selectedContacts);
  }
}
