import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SmsService } from '../../services/sms.service';
import { AuthService } from '../../services/auth.service'; // ✅ Import AuthService
import { SmsGeneratorComponent } from '../sms-generator/sms-generator.component';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SmsGeneratorComponent,SmsGeneratorComponent ],   // ✅ include this
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent {
  @ViewChild(SmsGeneratorComponent) smsGeneratorComponent?: SmsGeneratorComponent;

  smsForm: FormGroup;
  sending = false;
  responseMessage = '';

  constructor(
    private fb: FormBuilder,
    private smsService: SmsService,
    private authService: AuthService // ✅ Inject AuthService
  ) {
    this.smsForm = this.fb.group({
      destinationNumber: ['', [Validators.required]],
      textDecoded: ['', [Validators.required]]
    });
  }

  async sendSMS() {
    if (this.smsForm.invalid) return;

    const creatorId = this.authService.getCurrentUserId(); // ✅ Get user ID
    if (!creatorId) {
      this.responseMessage = "Utilisateur non authentifié.";
      return;
    }

    this.sending = true;
    this.responseMessage = '';

    const { destinationNumber, textDecoded } = this.smsForm.value;

    try {
      await this.smsService.sendSMS(destinationNumber, textDecoded, creatorId);
      this.responseMessage = 'Message envoyé avec succès !';
      this.smsForm.reset();
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
