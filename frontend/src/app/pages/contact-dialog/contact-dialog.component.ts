import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { GroupService, Group } from '../../services/group.service'; // Import GroupService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class AddContactDialogComponent implements OnInit {
  newContact = {
    matricule: '',
    nom: '',
    prenom: '',
    telephone_personnel: '',
    telephone_professionnel: '',
    service: '',
    cin: '',
    site: ''
  };
  groupes: Group[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    private contactService: ContactService,
    private groupService: GroupService // Inject GroupService
  ) {}

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

  addContact() {
    if (this.newContact.matricule && this.newContact.nom) {
      this.contactService.addContact(this.newContact).subscribe(
        (response) => {
          console.log('Contact added successfully:', response);
          this.dialogRef.close(this.newContact);
        },
        (error) => {
          console.error('Error adding contact:', error);
        }
      );
    }
  }
}
