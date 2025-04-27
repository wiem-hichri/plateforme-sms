import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-choose-sms-method',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './choose-sms-method.component.html',
  styleUrls: ['./choose-sms-method.component.scss']
})
export class ChooseSmsMethodComponent {
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  goTo(method: 'direct' | 'advanced') {
    this.closeModal();
    const path = method === 'direct' ? '/send-message' : '/mgc-sms';
    window.location.href = path;
  }
}
