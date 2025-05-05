import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MissionService, Mission } from '../../services/mission.service';

@Component({
  selector: 'app-delete-mission-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-mission-dialog.component.html',
  styleUrls: ['./delete-mission-dialog.component.scss'],
})
export class DeleteMissionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteMissionDialogComponent>,
    private missionService: MissionService,
    @Inject(MAT_DIALOG_DATA) public mission: Mission
  ) {}

  closeDialog() {
    this.dialogRef.close(false);
  }

  confirmDelete() {
    this.missionService.deleteMission(this.mission.id_mission).subscribe(
      (response) => {
        console.log('Mission deleted successfully:', response);
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error deleting mission:', error);
        this.dialogRef.close(false);
      }
    );
  }
}