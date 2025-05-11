import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DeviceService, Device } from '../../services/device.service';

@Component({
  selector: 'app-edit-device-dialog',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-device-dialog.component.html',
  styleUrls: ['./edit-device-dialog.component.scss'],
})
export class EditDeviceDialogComponent {
  @Input() device!: Device;
  showDialog = true;

  constructor(
    private deviceService: DeviceService
  ) {}

  closeDialog(): void {
    this.showDialog = false;
    // Additional logic to communicate closing to parent component would go here
  }

  updateDevice(): void {
    if (this.isFormValid() && this.device.id) {
      this.deviceService.updateDevice(this.device.id, this.device).subscribe({
        next: (response) => {
          console.log('Appareil mis à jour avec succès:', response);
          this.closeDialog();
          // Additional logic to communicate success to parent component would go here
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de l\'appareil:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.device.nom.trim() !== '' && 
           this.device.proprietaire.trim() !== '' &&
           this.device.type !== '';
  }
}
