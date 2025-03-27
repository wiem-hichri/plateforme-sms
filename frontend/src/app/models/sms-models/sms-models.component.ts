import { Component, OnInit } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sms-models',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './sms-models.component.html',
  styleUrls: ['./sms-models.component.scss']
})
export class SmsModelsComponent implements OnInit {
  models: any[] = [];
  showModal = false;
  selectedModel: any = { nom: '', contenu: '' };

  constructor(private smsModelService: SmsModelService) {}

  ngOnInit() {
    this.loadModels();
  }

  loadModels() {
    this.smsModelService.getAll().subscribe(models => {
      this.models = models;
    });
  }

  openAddModal() {
    this.selectedModel = { nom: '', contenu: '' };
    this.showModal = true;
  }

  openEditModal(model: any) {
    this.selectedModel = { ...model };
    this.showModal = true;
  }

  saveModel(model: any) {
    if (model.id) {
      this.smsModelService.update(model.id, model).subscribe(() => this.loadModels());
    } else {
      this.smsModelService.create(model).subscribe(() => this.loadModels());
    }
    this.closeModal();
  }

  deleteModel(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce modèle ?')) {
      this.smsModelService.delete(id).subscribe(() => this.loadModels());
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
