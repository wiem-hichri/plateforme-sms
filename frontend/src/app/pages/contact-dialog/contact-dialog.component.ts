import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { GroupService, Group } from '../../services/group.service';
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
    site: '',
    groups: [] as number[] // Explicitly type as an array of numbers
  };
  groupes: Group[] = []; // Explicitly type as an array of Group

  constructor(
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    private contactService: ContactService,
    private groupService: GroupService
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

  addContact() {
    if (this.newContact.matricule && this.newContact.nom && this.newContact.service && this.newContact.groups.length >= 0) {
      this.contactService.addContact(this.newContact).subscribe(
        (response) => {
          const contactId = response.contactId;
          this.contactService.associateContactToGroup(contactId, this.newContact.groups).subscribe(
            () => {
              console.log('Contact associated with groups successfully.');
              this.dialogRef.close(this.newContact);
            },
            (error) => {
              console.error('Error associating contact with groups:', error);
            }
          );
        },
        (error) => {
          console.error('Error adding contact:', error);
        }
      );
    } else {
      console.error('Missing required contact fields or groups');
    }
  }
}
