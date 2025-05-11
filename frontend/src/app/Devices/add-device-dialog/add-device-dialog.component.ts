import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DeviceService, Device } from '../../services/device.service';

@Component({
  selector: 'app-add-device-dialog',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
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

  showDialog = true;

  constructor(
    private deviceService: DeviceService
  ) {}

  closeDialog(): void {
    this.showDialog = false;
    // Additional logic to communicate closing to parent component would go here
  }

  addDevice(): void {
    if (this.newDevice.nom.trim() && this.newDevice.proprietaire.trim() && this.newDevice.type) {
      this.deviceService.createDevice(this.newDevice).subscribe({
        next: (response) => {
          console.log('Appareil ajouté avec succès:', response);
          this.closeDialog();
          // Additional logic to communicate success to parent component would go here
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'appareil:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.newDevice.nom.trim() !== '' && 
           this.newDevice.proprietaire.trim() !== '' &&
           this.newDevice.type !== '';
  }
}
