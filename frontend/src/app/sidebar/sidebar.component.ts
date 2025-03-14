import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; // ✅ Import NgIf
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgIf], // ✅ Add NgIf here
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  currentUserRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.currentUserRole = user?.role || ''; // Default to empty string if user is null
    });
  }
}
