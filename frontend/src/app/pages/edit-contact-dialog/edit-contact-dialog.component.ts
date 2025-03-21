import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { GroupService, Group } from '../../services/group.service'; // Import GroupService

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss'],
})
export class EditContactDialogComponent implements OnInit {
  contact: Contact;
  groupes: Group[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contact: Contact },
    private contactService: ContactService,
    private groupService: GroupService // Inject GroupService
  ) {
    this.contact = { ...data.contact };
  }

  ngOnInit() {
    this.fetchGroups();
  }

  fetchGroups() {
    this.groupService.getGroups().subscribe(
      (response) => {
        this.groupes = response.data || [];
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveContact() {
    this.contactService.updateContact(this.contact).subscribe(
      (updatedContact) => {
        console.log('Contact updated successfully:', updatedContact);
        this.dialogRef.close(updatedContact);
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }
}
