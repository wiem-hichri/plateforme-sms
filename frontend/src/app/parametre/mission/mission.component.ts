import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MissionService, Mission } from '../../services/mission.service';
import { finalize } from 'rxjs/operators';
import { AddMissionDialogComponent } from '../add-mission-dialog/add-mission-dialog.component';
import { EditMissionDialogComponent } from '../edit-mission-dialog/edit-mission-dialog.component';
import { DeleteMissionDialogComponent } from '../delete-mission-dialog/delete-mission-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    MatDialogModule,
    MatButtonModule ,
    MatIconModule
  ],
  providers: [MissionService]
})
export class MissionManagementComponent implements OnInit {
  missions: Mission[] = [];
  loading = false;
  error = '';

  constructor(
    private missionService: MissionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions(): void {
    this.loading = true;
    this.error = '';
    
    this.missionService.getMissions()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.missions = response.data;
          } else {
            this.missions = [];
            this.error = 'Format de réponse inattendu';
          }
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des missions: ' + (err.message || 'Erreur inconnue');
          console.error('Error loading missions', err);
        }
      });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(AddMissionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMissions();
      }
    });
  }

  openEditModal(mission: Mission): void {
    const dialogRef = this.dialog.open(EditMissionDialogComponent, {
      data: mission
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the mission in the list without requiring a full reload
        const index = this.missions.findIndex(m => m.id === mission.id);
        if (index !== -1) {
          this.missions[index] = result;
        } else {
          // If not found, reload the full list
          this.loadMissions();
        }
      }
    });
  }

  confirmDelete(mission: Mission): void {
    const dialogRef = this.dialog.open(DeleteMissionDialogComponent, {
      data: mission
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        // Remove the mission from the list without requiring a full reload
        this.missions = this.missions.filter(m => m.id !== mission.id);
      }
    });
  }
}