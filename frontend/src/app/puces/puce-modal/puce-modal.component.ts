// puce-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importez FormsModule ici

@Component({
  selector: 'app-puce-modal',
  standalone: true,
  imports: [FormsModule], // Ajoutez FormsModule ici
  templateUrl: './puce-modal.component.html',
  styleUrls: ['./puce-modal.component.scss']
})
export class PuceModalComponent {
  @Input() puce: any = {};
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.puce);
  }

  onClose() {
    this.close.emit();
  }
}
