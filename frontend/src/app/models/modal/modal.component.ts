import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SmsModelService } from '../../services/model.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ensure it imports FormsModule
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() model: any = { nom: '', contenu: '' };

  constructor(private smsModelService: SmsModelService) {}

  addModel() {
    if (this.model.nom && this.model.contenu) {
      this.smsModelService.create(this.model).subscribe({
        next: (res) => {
          console.log('✅ Modèle ajouté', res);
          this.model = { nom: '', contenu: '' };
        },
        error: (err) => {
          console.error('❌ Erreur:', err);
        },
      });
    }
  }
}