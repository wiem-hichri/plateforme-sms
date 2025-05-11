import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DeviceService, Device } from '../../services/device.service';
import { AddDeviceDialogComponent } from '../add-device-dialog/add-device-dialog.component';
import { EditDeviceDialogComponent } from '../edit-device-dialog/edit-device-dialog.component';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Device[] = [];
  displayedColumns: string[] = ['id', 'nom', 'proprietaire', 'type', 'actions'];

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.deviceService.getDevices().subscribe({
      next: (response) => {
        this.devices = response.data || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appareils:', error);
        this.showSnackBar('Erreur lors du chargement des appareils');
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDevices();
      }
    });
  }

  openEditDialog(device: Device): void {
    const dialogRef = this.dialog.open(EditDeviceDialogComponent, {
      width: '400px',
      data: { ...device }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDevices();
      }
    });
  }

  deleteDevice(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appareil?')) {
      this.deviceService.deleteDevice(id).subscribe({
        next: () => {
          this.loadDevices();
          this.showSnackBar('Appareil supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'appareil:', error);
          this.showSnackBar('Erreur lors de la suppression de l\'appareil');
        }
      });
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}