import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-edit-sms-model-dialog',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-sms-model-dialog.component.html',
  styleUrls: ['./edit-sms-model-dialog.component.scss'],
})
export class EditSmsModelDialogComponent {
  model: SmsModel;

  constructor(
    public dialogRef: MatDialogRef<EditSmsModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { model: SmsModel },
    private smsModelService: SmsModelService
  ) {
    this.model = { ...data.model };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateModel() {
    if (this.model.nom.trim() && this.model.contenu.trim() && this.model.id) {
      this.smsModelService.update(this.model.id, this.model).subscribe(
        (response) => {
          console.log('SMS model updated successfully:', response);
          this.dialogRef.close(response || this.model);
        },
        (error) => {
          console.error('Error updating SMS model:', error);
        }
      );
    }
  }
}