import { Component, OnInit } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { EditModelComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'app-sms-models',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, EditModelComponent],
  templateUrl: './sms-models.component.html',
  styleUrls: ['./sms-models.component.scss']
})
export class SmsModelsComponent implements OnInit {
  models: any[] = [];
  showAddModal = false;
  showEditModal = false;
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

  openAddModal() {
    this.showAddModal = true;
  }

  openEditModal(model: any) {
    this.selectedModel = { ...model };
    this.showEditModal = true;
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
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedModel = null;
  }
}
