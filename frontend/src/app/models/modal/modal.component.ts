import { Component, Output, EventEmitter } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-model-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class AddModelCardComponent {
  @Output() modelAdded = new EventEmitter<any>();
  
  nom = '';
  contenu = '';

  constructor(private smsModelService: SmsModelService) {}

  save() {
    const newModel = { nom: this.nom, contenu: this.contenu };
    this.smsModelService.create(newModel).subscribe(model => {
      this.modelAdded.emit(model);
      this.nom = '';
      this.contenu = '';
    });
  }
}
