import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [NgIf],  // Add NgIf here
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user: any;
  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
