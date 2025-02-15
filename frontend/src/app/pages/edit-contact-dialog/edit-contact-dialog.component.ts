import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent {
  contact: any;

  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contact = { ...data.contact }; // Clone to avoid modifying original directly
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveContact() {
    this.dialogRef.close(this.contact); // Pass updated contact back
  }
}
