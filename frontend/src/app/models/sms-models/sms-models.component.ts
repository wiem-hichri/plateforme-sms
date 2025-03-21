import { Component, OnInit } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-sms-models',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule], // ✅ Ensure FormsModule is imported
  templateUrl: './sms-models.component.html',
  styleUrls: ['./sms-models.component.scss']
})
export class SmsModelsComponent implements OnInit {
  models: any[] = [];
  showModal = false;
  selectedModel: any = { nom: '', contenu: '' }; // ✅ Ensure it's initialized

  constructor(private smsModelService: SmsModelService) {}

  ngOnInit() {
    this.loadModels();
  }

  loadModels() {
    this.smsModelService.getAll().subscribe(models => {
      this.models = models; // ✅ Assign models properly
    });
  }

  openAddModal() {
    this.selectedModel = { nom: '', contenu: '' }; // ✅ Initialize new model
    this.showModal = true;
  }

  openEditModal(model: any) {
    this.selectedModel = { ...model }; // ✅ Clone model to prevent unwanted updates
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
