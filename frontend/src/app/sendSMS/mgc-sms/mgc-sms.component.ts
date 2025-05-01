import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GroupService } from '../../services/group.service';
import { SmsModelService } from '../../services/model.service';
import { SmsService } from '../../services/sms.service'; // ✅
import { AuthService } from '../../services/auth.service'; // ✅

@Component({
  selector: 'app-mgc',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mgc-sms.component.html',
  styleUrls: ['./mgc-sms.component.scss'] // Make sure this file exists or remove this line
})
export class MgcComponent implements OnInit {
  groups: any[] = [];
  models: any[] = [];
  selectedGroupId: number | null = null;
  selectedModelId: number | null = null;
  excelFile: File | null = null;
  generatedMessages: any[] = [];
  sending = false;
  responseMessage = '';

  constructor(
    private groupService: GroupService,
    private smsmodelService: SmsModelService,
    private smsService: SmsService,           // ✅
    private authService: AuthService,         // ✅
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadModels();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(response => {
      this.groups = Array.isArray(response) ? response : response.data ?? [];
    });
  }

  loadModels() {
    this.smsmodelService.getAll().subscribe(models => {
      this.models = models;
    });
  }

  onGroupChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedGroupId = Number(value);
  }

  onModelChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedModelId = Number(value);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.excelFile = file;
    }
  }

  generateMessages() {
    if (!this.selectedGroupId || !this.selectedModelId || !this.excelFile) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.excelFile);
    formData.append('groupId', this.selectedGroupId.toString());
    formData.append('modeleId', this.selectedModelId.toString());

    this.http.post<any>(`http://localhost:3000/api/models/messageConfidentiel/${this.selectedModelId}/${this.selectedGroupId}`, formData).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.generatedMessages = response.messages;
        } else {
          alert('Error generating messages: ' + response.message);
        }
      },
      (error) => {
        alert('Error generating messages: ' + error.message);
      }
    );
  }

  async sendMessages() {
    if (this.generatedMessages.length === 0) {
      alert('No messages to send');
      return;
    }

    const creatorId = this.authService.getCurrentUserId(); // ✅
    if (!creatorId) {
      this.responseMessage = "Utilisateur non authentifié.";
      return;
    }

    this.sending = true;
    this.responseMessage = '';

    try {
      for (const msg of this.generatedMessages) {
        await this.smsService.sendSMS(msg.phone, msg.text, creatorId); // ✅ use the same pattern
      }

      this.responseMessage = 'Tous les messages ont été envoyés avec succès !';
      this.generatedMessages = []; // optional: clear the list after sending
    } catch (error) {
      this.responseMessage = "Erreur lors de l'envoi de certains messages.";
    } finally {
      this.sending = false;
    }
  }
}
