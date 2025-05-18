import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Device, DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-edit-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './edit-device-dialog.component.html',
  styleUrls: ['./edit-device-dialog.component.scss']
})
export class EditDeviceDialogComponent implements OnInit {
  device: Device;
  deviceTypes: string[] = [];
  isLoading = false;
  isLoadingTypes = true;
  errorMessage: string | null = null;
  showDialog = true;

  constructor(
    private deviceService: DeviceService,
    public dialogRef: MatDialogRef<EditDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Device
  ) {
    // Create a deep copy to avoid modifying the original data directly
    this.device = { ...data };
    console.log('Initial device type:', this.device.type);
  }

  ngOnInit(): void {
    // Fetch device types from database
    this.deviceService.getDeviceTypes().subscribe({
      next: (types) => {
        this.deviceTypes = types;
        this.isLoadingTypes = false;
        console.log('Device types loaded:', this.deviceTypes);
      },
      error: (error) => {
        console.error('Error loading device types:', error);
        this.isLoadingTypes = false;
        // Fallback to hardcoded values if API fails
        this.deviceTypes = ['float', 'ORfloat', 'MIX'];
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;

    if (!this.device.id) {
      this.errorMessage = 'ID de l\'appareil manquant';
      this.isLoading = false;
      return;
    }

    console.log('Submitting device with type:', this.device.type);
    
    this.deviceService.updateDevice(this.device.id, this.device).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close('success');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors de la mise à jour de l\'appareil';
        console.error('Erreur de mise à jour:', error);
      }
    });
  }

  private validateForm(): boolean {
    this.errorMessage = null;
    
    if (!this.device.nom?.trim()) {
      this.errorMessage = 'Le nom de l\'appareil est requis';
      return false;
    }
    
    if (!this.device.proprietaire?.trim()) {
      this.errorMessage = 'Le propriétaire est requis';
      return false;
    }
    
    if (!this.device.type) {
      this.errorMessage = 'Le type d\'appareil est requis';
      return false;
    }
    
    return true;
  }
} 