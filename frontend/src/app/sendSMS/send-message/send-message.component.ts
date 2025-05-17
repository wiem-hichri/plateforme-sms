import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SmsService } from '../../services/sms.service';
import { AuthService } from '../../services/auth.service';
import { ContactService } from '../../services/contact.service';
import { SmsGeneratorComponent } from '../sms-generator/sms-generator.component';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SmsGeneratorComponent],
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  @ViewChild(SmsGeneratorComponent) smsGeneratorComponent?: SmsGeneratorComponent;

  smsForm: FormGroup;
  sending = false;
  responseMessage = '';
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContactPhone: string = '';
  selectedContactName: string = '';
  selectedContactPrenom: string = '';

  selectedContactId: number | null = null;
  showDropdown = false;

  constructor(
    private fb: FormBuilder,
    private smsService: SmsService,
    private authService: AuthService,
    private contactService: ContactService
  ) {
    this.smsForm = this.fb.group({
      contactSearch: ['', [Validators.required]],
      textDecoded: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadContacts();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('#contactSearch') && 
        !(event.target as HTMLElement).closest('.contact-dropdown')) {
      this.showDropdown = false;
    }
  }

  loadContacts() {
    this.contactService.getContacts().subscribe({
      next: (response) => {
        this.contacts = response.data || [];
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
      }
    });
  }

  filterContacts() {
    const searchValue = this.smsForm.get('contactSearch')?.value?.toLowerCase();
    
    if (!searchValue) {
      this.filteredContacts = [];
      this.showDropdown = false;
      return;
    }
    
    this.filteredContacts = this.contacts.filter(contact => 
      contact.nom.toLowerCase().includes(searchValue) || 
      contact.telephone_professionnel.toLowerCase().includes(searchValue) ||
      contact.prenom.toLowerCase().includes(searchValue)
    );
    
    this.showDropdown = this.filteredContacts.length > 0;
    
    // Clear selection if search field is modified
    if (this.selectedContactId) {
      this.selectedContactId = null;
      this.selectedContactPhone = '';
      this.selectedContactName = '';
      this.selectedContactPrenom='';
    }
  }

  selectContact(contact: Contact) {
    this.selectedContactId = contact.id;
    this.selectedContactPhone = contact.telephone_professionnel;
    this.selectedContactName = contact.nom;
    this.selectedContactPrenom= contact.prenom;

    this.smsForm.get('contactSearch')?.setValue(contact.nom);
    this.showDropdown = false;
  }

  async sendSMS() {
    if (!this.selectedContactId || !this.selectedContactPhone) {
      this.responseMessage = "Veuillez sélectionner un contact valide.";
      return;
    }

    if (this.smsForm.get('textDecoded')?.invalid) {
      this.responseMessage = "Le message est requis.";
      return;
    }

    const SenderID = this.authService.getCurrentUserId();
    if (!SenderID) {
      this.responseMessage = "Utilisateur non authentifié.";
      return;
    }

    this.sending = true;
    this.responseMessage = '';

    const textDecoded = this.smsForm.get('textDecoded')?.value;

    try {
      await this.smsService.sendSMS(this.selectedContactPhone, textDecoded, SenderID, null);
      this.responseMessage = 'Message envoyé avec succès !';
      this.smsForm.reset();
      this.selectedContactPhone = '';
      this.selectedContactName = '';
      this.selectedContactId = null;
    } catch (error) {
      this.responseMessage = "Erreur lors de l'envoi du message.";
    } finally {
      this.sending = false;
    }
  }

  openGeneratorModal() {
    this.smsGeneratorComponent?.openModal();
  }
}