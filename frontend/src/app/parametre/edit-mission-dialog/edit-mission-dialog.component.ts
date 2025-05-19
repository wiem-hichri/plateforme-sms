import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MissionService, Mission } from '../../services/mission.service';

@Component({
  selector: 'app-edit-mission-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-mission-dialog.component.html',
  styleUrls: ['./edit-mission-dialog.component.scss'],
})
export class EditMissionDialogComponent {
  mission: { type_mission: string };

  constructor(
    public dialogRef: MatDialogRef<EditMissionDialogComponent>,
    private missionService: MissionService,
    @Inject(MAT_DIALOG_DATA) public data: Mission
  ) {
    // Clone the mission data to avoid direct modification
    this.mission = { type_mission: data.type_mission };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateMission() {
    if (this.mission.type_mission.trim()) { // Ensure type_mission is not empty
      this.missionService.updateMission(this.data.id, this.mission).subscribe(
        (response) => {
          console.log('Mission updated successfully:', response);
          
          // Return the updated mission data
          const updatedMission: Mission = {
            id: this.data.id,
            type_mission: this.mission.type_mission
          };
          
          this.dialogRef.close(updatedMission);
        },
        (error) => {
          console.error('Error updating mission:', error);
        }
      );
    }
  }
}