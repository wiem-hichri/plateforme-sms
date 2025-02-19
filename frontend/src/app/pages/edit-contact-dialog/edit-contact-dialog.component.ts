import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss'],
})
export class EditContactDialogComponent {
  contact: Contact;

  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contact: Contact },
    private contactService: ContactService
  ) {
    this.contact = { ...data.contact }; // ✅ Ensure contact is correctly assigned
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveContact() {
    this.contactService.updateContact(this.contact).subscribe(
      (updatedContact) => {
        console.log('Contact updated successfully:', updatedContact);
        this.dialogRef.close(updatedContact); // ✅ Return updated contact
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }
}
