import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SmsModelService } from '../../services/model.service';

interface SmsModel {
  id?: number;
  nom: string;
  contenu: string;
  is_confidential: boolean;
}

@Component({
  selector: 'app-add-sms-model-dialog',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './add-sms-model-dialog.component.html',
  styleUrls: ['./add-sms-model-dialog.component.scss'],
})
export class AddSmsModelDialogComponent {
  newModel: SmsModel = {
    nom: '',
    contenu: '',
    is_confidential: false
  };

  constructor(
    public dialogRef: MatDialogRef<AddSmsModelDialogComponent>,
    private smsModelService: SmsModelService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addModel() {
    if (this.newModel.nom.trim() && this.newModel.contenu.trim()) {
      this.smsModelService.create(this.newModel).subscribe(
        (response) => {
          console.log('SMS model added successfully:', response);
          this.dialogRef.close(response || this.newModel);
        },
        (error) => {
          console.error('Error adding SMS model:', error);
        }
      );
    }
  }
}