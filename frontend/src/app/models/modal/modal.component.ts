import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ensure it imports FormsModule
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() model: any = { nom: '', contenu: '' };
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  saveModel() {
    this.save.emit(this.model);
  }
}
