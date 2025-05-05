import { Component, OnInit, ViewChild } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddModelCardComponent } from '../modal/modal.component';
import { EditModelCardComponent } from '../edit-modal/edit-modal.component';
import { SmsGeneratorComponent } from '../../sendSMS/sms-generator/sms-generator.component';

@Component({
  selector: 'app-sms-models',
  standalone: true,
  imports: [CommonModule, FormsModule, AddModelCardComponent,MatButtonModule, MatIconModule, EditModelCardComponent,SmsGeneratorComponent],
  templateUrl: './sms-models.component.html',
  styleUrls: ['./sms-models.component.scss']
})
export class SmsModelsComponent implements OnInit {
    @ViewChild(SmsGeneratorComponent) smsGeneratorComponent?: SmsGeneratorComponent;
  
  models: any[] = [];
  showAddCard = false;
  selectedModel: any = null;

  constructor(private smsModelService: SmsModelService) {}

  ngOnInit() {
    this.loadModels();
  }

  loadModels() {
    this.smsModelService.getAll().subscribe(models => {
      this.models = models;
    });
  }

  openAddCard() {
    this.showAddCard = true;
    this.selectedModel = null;
  }

  openEditCard(model: any) {
    this.selectedModel = { ...model }; // envoyer tout le modèle, pas juste l'id
    this.showAddCard = false;
  }

  onModelAdded(newModel: any) {
    this.models.push(newModel);
    this.showAddCard = false;
  }

  onModelUpdated(updatedModel: any) {
    const index = this.models.findIndex(m => m.id === updatedModel.id);
    if (index !== -1) {
      this.models[index] = updatedModel;
    }
    this.selectedModel = null;
  }

  deleteModel(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce modèle ?')) {
      this.smsModelService.delete(id).subscribe(() => {
        this.models = this.models.filter(model => model.id !== id);
      });
    }
  }
  openGeneratorModal() {
    this.smsGeneratorComponent?.openModal();
  }
}
