import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss'],
})
export class EditContactDialogComponent implements OnInit {
  contact: Contact;

  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contact: Contact },
    private contactService: ContactService,
    private siteService: SiteService
  ) {
    this.contact = { ...data.contact };
  }
  sites: any[] = [];

  ngOnInit(): void {
    this.siteService.getSites().subscribe({
      next: (response) => {
        console.log('Réponse API pour les sites:', response);
        this.sites = response.data;

        // S'assurer que le site sélectionné est encore valide
        if (!this.sites.some(site => site.site_name === this.contact.site)) {
          this.contact.site = '';
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sites:', err);
      }
    });
  }



 

  closeDialog() {
    this.dialogRef.close();
  }

  saveContact() {
    this.contactService.updateContact(this.contact).subscribe(
      (updatedContact) => {
        console.log('Contact updated successfully:', updatedContact);
        this.dialogRef.close(updatedContact);
        window.location.reload(); 
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }
}
