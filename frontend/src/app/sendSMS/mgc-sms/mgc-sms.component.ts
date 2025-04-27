import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SmsService } from '../../services/sms.service';
import { ContactService } from '../../services/contact.service';
import { GroupService } from '../../services/group.service';
import { SmsModelService } from '../../services/model.service';

@Component({
  selector: 'app-envoi-sms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mgc-sms.component.html',
  styleUrls: ['./mgc-sms.component.scss']
})
export class EnvoiSmsComponent implements OnInit {
  contacts: any[] = [];
  groups: any[] = [];
  models: any[] = [];

  selectedContactId: number | null = null;
  selectedGroupIds: number[] = [];
  selectedModelId: number | null = null;

  groupSearch: string = '';

  constructor(
    private smsService: SmsService,
    private contactService: ContactService,
    private groupService: GroupService,
    private modelService: SmsModelService
  ) {}

  ngOnInit() {
    this.contactService.getContacts().subscribe(data => this.contacts = data);
    this.groupService.getGroups().subscribe(data => this.groups = data.data);
    this.modelService.getAll().subscribe(data => this.models = data);
  }

  get selectedContact() {
    return this.contacts.find(c => c.id === this.selectedContactId);
  }

  get selectedGroups() {
    return this.groups.filter(g => this.selectedGroupIds.includes(g.id));
  }

  get selectedModel() {
    return this.models.find(m => m.id === this.selectedModelId);
  }

  get filteredGroups() {
    const query = this.groupSearch.trim().toLowerCase();
    return this.groups.filter(g => g.nom.toLowerCase().includes(query));
  }

  toggleGroupSelection(groupId: number) {
    const index = this.selectedGroupIds.indexOf(groupId);
    if (index > -1) {
      this.selectedGroupIds.splice(index, 1);
    } else {
      this.selectedGroupIds.push(groupId);
    }
  }

  sendMessage() {
    const destinationNumbers: string[] = [];

    if (this.selectedContact) {
      destinationNumbers.push(this.selectedContact.numero);
    }

    this.selectedGroups.forEach(group => {
      if (group.contacts) {
        group.contacts.forEach((contact: any) => {
          if (contact.numero && !destinationNumbers.includes(contact.numero)) {
            destinationNumbers.push(contact.numero);
          }
        });
      }
    });

    const messageContent = this.selectedModel?.contenu || '';
    const creatorId = 1; // Replace with actual logged-in user ID

    Promise.all(
      destinationNumbers.map(num =>
        this.smsService.sendSMS(num, messageContent, creatorId)
      )
    ).then(() => {
      alert('📤 SMS envoyé avec succès à tous les destinataires !');
      this.selectedContactId = null;
      this.selectedGroupIds = [];
      this.selectedModelId = null;
      this.groupSearch = '';
    }).catch(error => {
      console.error('Erreur lors de l\'envoi des SMS :', error);
      alert('❌ Une erreur est survenue lors de l\'envoi.');
    });
  }
}
