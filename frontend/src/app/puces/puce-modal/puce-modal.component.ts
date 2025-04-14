import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-puce-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './puce-modal.component.html',
  styleUrls: ['./puce-modal.component.scss']
})
export class PuceModalComponent {
  @Input() puce: any = {};
  @Input() contacts: any[] = [];
  @Input() missions: any[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  operateurs: string[] = ['Orange', 'Ooredoo', 'TunisieTelecom'];
  etats: string[] = ['Active', 'Suspendue', 'Expiré'];

  onSave() {
    this.save.emit(this.puce);  // Emit the entire puce object
  }

  onClose() {
    this.close.emit();
  }
}
