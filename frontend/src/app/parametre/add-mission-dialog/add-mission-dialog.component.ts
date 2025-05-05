import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-add-mission-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-mission-dialog.component.html',
  styleUrls: ['./add-mission-dialog.component.scss'],
})
export class AddMissionDialogComponent {
  newMission = { type_mission: '' };

  constructor(
    public dialogRef: MatDialogRef<AddMissionDialogComponent>,
    private missionService: MissionService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addMission() {
    if (this.newMission.type_mission.trim()) { // Ensure type_mission is not empty
      this.missionService.createMission(this.newMission).subscribe(
        (response) => {
          console.log('Mission added successfully:', response);
          this.dialogRef.close(response?.data || this.newMission); // Return the created mission
        },
        (error) => {
          console.error('Error adding mission:', error);
        }
      );
    }
  }
}