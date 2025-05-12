import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeviceService, Device } from '../../services/device.service';

@Component({
  selector: 'app-edit-device-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-device-dialog.component.html',
  styleUrls: ['./edit-device-dialog.component.scss']
})
export class EditDeviceDialogComponent {
  device: Device;
  deviceTypes = ['float', 'ORfloat'];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private deviceService: DeviceService,
    @Inject('DIALOG_DATA') public data: { device: Device },
    @Inject('DIALOG_REF') private dialogRef: any
  ) {
    this.device = { ...data.device };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateDevice(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (!this.device.id) {
      this.errorMessage = 'Device ID is missing';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.deviceService.updateDevice(this.device.id, this.device).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialogRef.close(response || this.device);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to update device';
        console.error('Update error:', error);
      }
    });
  }

  private isFormValid(): boolean {
    return !!this.device.nom?.trim() && 
           !!this.device.proprietaire?.trim() &&
           !!this.device.type;
  }
}