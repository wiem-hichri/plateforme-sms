import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DeviceService, Device } from '../../services/device.service';

@Component({
  selector: 'app-add-device-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss'],
})
export class AddDeviceDialogComponent implements OnInit {
  deviceTypes: string[] = [];
  isLoading = true;
  
  newDevice: Device = {
    nom: '',
    proprietaire: '',
    type: ''
  };

  showDialog = true;

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    // Fetch device types from database
    this.deviceService.getDeviceTypes().subscribe({
      next: (types) => {
        this.deviceTypes = types;
        this.isLoading = false;
        console.log('Device types loaded:', this.deviceTypes);
      },
      error: (error) => {
        console.error('Error loading device types:', error);
        this.isLoading = false;
        // Fallback to hardcoded values if API fails
        this.deviceTypes = ['float', 'ORfloat', 'MIX'];
      }
    });
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  addDevice(): void {
    if (this.isFormValid()) {
      this.deviceService.createDevice(this.newDevice).subscribe({
        next: (response) => {
          console.log('Appareil ajouté avec succès:', response);
          window.location.reload(); // 🚨 Force full reload
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