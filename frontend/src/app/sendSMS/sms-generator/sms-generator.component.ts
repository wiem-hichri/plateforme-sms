import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IconComponent } from './icon.component';
import { SmsGeneratorService, Message} from '../../services/sms-generator.service'

@Component({
  selector: 'app-sms-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IconComponent],
  templateUrl: './sms-generator.component.html',
  styleUrls: ['./sms-generator.component.scss']
})
export class SmsGeneratorComponent implements OnInit {
  isOpen = false;
  prompt = '';
  isLoading = false;
  conversation: Message[] = [];
  error: string | null = null;

  constructor(private smsService: SmsGeneratorService) {}

  ngOnInit(): void {}

  toggleModal(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.conversation = [];
      this.prompt = '';
      this.error = null;
    }
  }

  handleSubmit(): void {
    if (!this.prompt.trim()) return;

    this.isLoading = true;
    this.error = null;
    const currentPrompt = this.prompt;
    this.prompt = '';

    this.smsService.generateSms(currentPrompt).subscribe({
      next: (data) => {
        this.conversation = data.conversationHistory;
      },
      error: (err) => {
        this.error = err.error?.error || 'Échec de la génération du SMS';
      },
      complete: () => {
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }

  scrollToBottom(): void {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSubmit();
    }
  }
  openModal(): void {
    if (!this.isOpen) this.toggleModal();
  }
}
