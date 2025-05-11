import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SmsModeModalComponent } from '../sendSMS/sms-mode-modal/sms-mode-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule, SmsModeModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild(SmsModeModalComponent) smsModeModal!: SmsModeModalComponent;
  
  currentUserRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.currentUserRole = user?.role || ''; // Default to empty string if user is null
    });
  }

  openSmsModal(event: Event) {
    event.preventDefault(); // Prevent default navigation
    this.smsModeModal.open();
  }
}