import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-add-groups-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-groups-dialog.component.html',
  styleUrls: ['./add-groups-dialog.component.scss'],
})
export class AddGroupsDialogComponent {
  newGroup = { nom: '' };

  constructor(
    public dialogRef: MatDialogRef<AddGroupsDialogComponent>,
    private groupService: GroupService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addGroup() {
    if (this.newGroup.nom.trim()) { // ✅ Ensure nom is not empty
      this.groupService.addGroup(this.newGroup).subscribe(
        (response) => {
          console.log('Group added successfully:', response);
          this.dialogRef.close(response?.data || this.newGroup); // ✅ Ensure we send back the correct data
        },
        (error) => {
          console.error('Error adding group:', error);
        }
      );
    }
  }
  
}
