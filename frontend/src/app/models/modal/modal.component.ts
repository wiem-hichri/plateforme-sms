import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SmsGeneratorComponent } from '../../sendSMS/sms-generator/sms-generator.component';


@Component({
  selector: 'app-add-model-card',
  standalone: true,
  imports: [CommonModule, FormsModule,SmsGeneratorComponent ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class AddModelCardComponent {
    @ViewChild(SmsGeneratorComponent) smsGeneratorComponent?: SmsGeneratorComponent;
  
  @Output() modelAdded = new EventEmitter<any>();
  
  nom = '';
  contenu = '';
  is_confidential = false;

  constructor(private smsModelService: SmsModelService) {}

  save() {
    const newModel = { nom: this.nom, contenu: this.contenu, is_confidential: this.is_confidential };
    this.smsModelService.create(newModel).subscribe(model => {
      this.modelAdded.emit(model);
      this.nom = '';
      this.contenu = '';
      this.is_confidential = false;
      
    });
  }
  openGeneratorModal() {
      this.smsGeneratorComponent?.openModal();
    }
}
