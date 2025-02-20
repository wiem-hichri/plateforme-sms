import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service'; // ✅ Import service

interface Group {
  id?: number;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-add-groups-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Import FormsModule
  templateUrl: './add-groups-dialog.component.html',
  styleUrls: ['./add-groups-dialog.component.scss']
})
export class AddGroupsDialogComponent {
  newGroup: Group = { nom: '' }; // ✅ Initialize correctly

  constructor(
    public dialogRef: MatDialogRef<AddGroupsDialogComponent>,
    private groupService: GroupService // ✅ Inject GroupService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  addGroup() {
    if (this.newGroup.nom.trim()) { // ✅ Ensure `nom` is not empty
      this.groupService.addGroup(this.newGroup).subscribe(
        (response) => {
          console.log('Group added successfully:', response);
          this.dialogRef.close(response); // ✅ Close dialog & return the new group
        },
        (error) => {
          console.error('Error adding group:', error);
        }
      );
    }
  }
}
