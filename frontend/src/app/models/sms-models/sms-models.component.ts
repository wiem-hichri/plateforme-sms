import { Component, OnInit, ViewChild } from '@angular/core';
import { SmsModelService } from '../../services/model.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SmsGeneratorComponent } from '../../sendSMS/sms-generator/sms-generator.component';
import { AddSmsModelDialogComponent } from '../add-sms-model-dialog/add-sms-model-dialog.component';
import { EditSmsModelDialogComponent } from '../edit-sms-model-dialog/edit-sms-model-dialog.component';

interface SmsModel {
  id?: number;
  nom: string;
  contenu: string;
  is_confidential: boolean;
  prenom?: string;
  createur_nom?: string;
}

@Component({
  selector: 'app-sms-models',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule,
    MatIconModule,
    SmsGeneratorComponent
  ],
  templateUrl: './sms-models.component.html',
  styleUrls: ['./sms-models.component.scss']
})
export class SmsModelsComponent implements OnInit {
  @ViewChild(SmsGeneratorComponent) smsGeneratorComponent?: SmsGeneratorComponent;
  
  models: SmsModel[] = [];

  constructor(
    private smsModelService: SmsModelService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadModels();
  }

  loadModels() {
    this.smsModelService.getAll().subscribe(models => {
      this.models = models;
    });
  }

  openAddCard() {
    const dialogRef = this.dialog.open(AddSmsModelDialogComponent, {
      width: '400px'
    });
    
    dialogRef.afterClosed().subscribe((newModel: SmsModel | undefined) => {
      if (newModel) {
        this.loadModels();
      }
    });
  }

  openEditCard(model: SmsModel) {
    const dialogRef = this.dialog.open(EditSmsModelDialogComponent, {
      width: '400px',
      data: { model }
    });
    
    dialogRef.afterClosed().subscribe((updatedModel: SmsModel | undefined) => {
      if (updatedModel) {
        this.loadModels();
      }
    });
  }

  deleteModel(id: number | undefined) {
    if (id === undefined) {
      console.error('Cannot delete model with undefined id');
      return;
    }
    
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