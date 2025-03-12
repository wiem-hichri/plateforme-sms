import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-edit-group-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-groups-dialog.component.html',
  styleUrls: ['./edit-groups-dialog.component.scss'],
})
export class EditGroupDialogComponent {
  groupe: Group;

  constructor(
    public dialogRef: MatDialogRef<EditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupe: Group },
    private groupService: GroupService
  ) {
    this.groupe = { ...data.groupe }; // ✅ Make a copy of the group data
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveGroup() {
    this.groupService.updateGroup(this.groupe).subscribe(
      (updatedGroup) => {
        console.log('Group updated successfully:', updatedGroup);
        this.dialogRef.close(updatedGroup); // ✅ Return updated group
      },
      (error) => {
        console.error('Error updating group:', error);
      }
    );
  }
}
