import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { DeviceService, Device } from '../../services/device.service';

@Component({
  selector: 'app-add-device-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss'],
})
export class AddDeviceDialogComponent {
  newDevice: Device = { 
    nom: '',
    proprietaire: '',
    type: ''
  };


  constructor(
    public dialogRef: MatDialogRef<AddDeviceDialogComponent>,
    private deviceService: DeviceService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  addDevice(): void {
    if (this.newDevice.nom.trim() && this.newDevice.proprietaire.trim() && this.newDevice.type) {
      this.deviceService.createDevice(this.newDevice).subscribe({
        next: (response) => {
          console.log('Appareil ajouté avec succès:', response);
          this.dialogRef.close(response || this.newDevice);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'appareil:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.newDevice.nom.trim() !== '' && 
           this.newDevice.proprietaire.trim() !== '' ;
  }
}