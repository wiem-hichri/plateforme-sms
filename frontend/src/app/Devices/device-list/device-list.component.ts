import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeviceService, Device } from '../../services/device.service';
import { AddDeviceDialogComponent } from '../add-device-dialog/add-device-dialog.component';
import { EditDeviceDialogComponent } from '../edit-device-dialog/edit-device-dialog.component';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
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
  isLoading = false;

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.isLoading = true;
    this.deviceService.getDevices().subscribe({
      next: (response) => {
        this.devices = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appareils:', error);
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadDevices();
      }
    });
  }

  openEditDialog(device: Device): void {
    const dialogRef = this.dialog.open(EditDeviceDialogComponent, {
      width: '500px',
      data: device,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadDevices();
      }
    });
  }

  deleteDevice(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appareil?')) {
      this.isLoading = true;
      this.deviceService.deleteDevice(id).subscribe({
        next: () => {
          this.loadDevices();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'appareil:', error);
          this.isLoading = false;
        }
      });
    }
  }
}