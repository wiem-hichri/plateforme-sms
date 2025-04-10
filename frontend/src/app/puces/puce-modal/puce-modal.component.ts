import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-puce-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './puce-modal.component.html',
  styleUrls: ['./puce-modal.component.scss']
})
export class PuceModalComponent {
  @Input() puce: any = {};
  @Input() contacts: any[] = [];
  @Input() missions: any[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.puce);
  }

  onClose() {
    this.close.emit();
  }
}
