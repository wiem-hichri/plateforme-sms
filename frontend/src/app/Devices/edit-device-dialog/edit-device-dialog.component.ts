import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { DeviceService, Device } from '../../services/device.service';

@Component({
  selector: 'app-edit-device-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './edit-device-dialog.component.html',
  styleUrls: ['./edit-device-dialog.component.scss'],
})
export class EditDeviceDialogComponent {
  

  constructor(
    public dialogRef: MatDialogRef<EditDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public device: Device,
    private deviceService: DeviceService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateDevice(): void {
    if (this.isFormValid() && this.device.id) {
      this.deviceService.updateDevice(this.device.id, this.device).subscribe({
        next: (response) => {
          console.log('Appareil mis à jour avec succès:', response);
          this.dialogRef.close(this.device);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de l\'appareil:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.device.nom.trim() !== '' && 
           this.device.proprietaire.trim() !== '' ;

  }
}