import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-model-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModelCardComponent implements OnChanges {
  @Input() model: any;
  @Output() modelUpdated = new EventEmitter<any>();

  nom = '';
  contenu = '';

  constructor(private smsModelService: SmsModelService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model) {
      this.nom = this.model.nom;
      this.contenu = this.model.contenu;
    }
  }

  save() {
    const updatedModel = { id: this.model.id, nom: this.nom, contenu: this.contenu };
    this.smsModelService.update(this.model.id, updatedModel).subscribe(model => {
      this.modelUpdated.emit(model);
    });
  }
}
