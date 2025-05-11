// src/app/components/sms-mode-modal/sms-mode-modal.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sms-mode-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sms-mode-modal.component.html',
  styleUrls: ['./sms-mode-modal.component.scss']
})
export class SmsModeModalComponent {
  @Output() modeSelected = new EventEmitter<string>();
  
  isOpen = false;

  constructor(private router: Router) {}

  open() {
    this.isOpen = true;
    document.body.classList.add('modal-open');
  }

  close() {
    this.isOpen = false;
    document.body.classList.remove('modal-open');
  }

  closeModal(event: MouseEvent) {
    // Only close if the backdrop itself is clicked, not the modal content
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  selectMode(mode: 'direct' | 'mgc') {
    this.modeSelected.emit(mode);
    this.close();
    
    // Navigate to the appropriate route based on selected mode
    if (mode === 'direct') {
      this.router.navigate(['/send-message']);
    } else if (mode === 'mgc') {
      this.router.navigate(['/mgc-sms']);
    }
  }
}