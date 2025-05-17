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
  
  // Store both phone numbers
  selectedContactPhonePro: string = '';
  selectedContactPhonePerso: string = '';
  selectedContactName: string = '';
  selectedContactPrenom: string = '';
  selectedPhoneType: 'professional' | 'personal' = 'professional';

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
      (contact.telephone_professionnel && contact.telephone_professionnel.toLowerCase().includes(searchValue)) ||
      (contact.telephone_personnel && contact.telephone_personnel.toLowerCase().includes(searchValue)) ||
      contact.prenom.toLowerCase().includes(searchValue)
    );
    
    this.showDropdown = this.filteredContacts.length > 0;
    
    // Clear selection if search field is modified
    if (this.selectedContactId) {
      this.selectedContactId = null;
      this.selectedContactPhonePro = '';
      this.selectedContactPhonePerso = '';
      this.selectedContactName = '';
      this.selectedContactPrenom = '';
      this.selectedPhoneType = 'professional';
    }
  }

  selectContact(contact: Contact) {
    this.selectedContactId = contact.id;
    this.selectedContactPhonePro = contact.telephone_professionnel || '';
    this.selectedContactPhonePerso = contact.telephone_personnel || '';
    this.selectedContactName = contact.nom;
    this.selectedContactPrenom = contact.prenom;
    
    // Determine which phone to use (prefer professional, fall back to personal)
    this.selectedPhoneType = this.selectedContactPhonePro ? 'professional' : 'personal';

    this.smsForm.get('contactSearch')?.setValue(contact.nom);
    this.showDropdown = false;
  }

  // Get the appropriate phone number based on availability
  get selectedContactPhone(): string {
    return this.selectedPhoneType === 'professional' && this.selectedContactPhonePro 
      ? this.selectedContactPhonePro 
      : this.selectedContactPhonePerso;
  }

  async sendSMS() {
    if (!this.selectedContactId || !this.selectedContactPhone) {
      this.responseMessage = "Veuillez sélectionner un contact valide avec un numéro de téléphone.";
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
      this.selectedContactPhonePro = '';
      this.selectedContactPhonePerso = '';
      this.selectedContactName = '';
      this.selectedContactPrenom = '';
      this.selectedContactId = null;
      this.selectedPhoneType = 'professional';
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