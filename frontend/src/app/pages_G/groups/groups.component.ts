import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService, Group } from '../../services/group.service';
import { AddGroupsDialogComponent } from '../add-groups-dialog/add-groups-dialog.component';
import { EditGroupDialogComponent } from '../edit-groups-dialog/edit-groups-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];

  constructor(private groupService: GroupService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchGroups();
  }

  fetchGroups() {
    this.groupService.getGroups().subscribe(
      (response) => {
        console.log('✅ Groups fetched:', response);
        this.groups = response.data || [];
      },
      (error) => {
        console.error('❌ Error fetching groups:', error);
      }
    );
  }

  openAddGroupModal() {
    const dialogRef = this.dialog.open(AddGroupsDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newGroup: Group | undefined) => {
      if (newGroup) {
        console.log('✅ New group added:', newGroup);
        this.groups.push(newGroup);
        this.fetchGroups(); // Ensure backend sync
      }
    });
  }

  openEditGroupModal(group: Group) {
    const dialogRef = this.dialog.open(EditGroupDialogComponent, {
      width: '400px',
      data: { groupe: group },
    });

    dialogRef.afterClosed().subscribe((updatedGroup: Group | undefined) => {
      if (updatedGroup) {
        console.log('✅ Group updated:', updatedGroup);
        const index = this.groups.findIndex((g) => g.id === updatedGroup.id);
        if (index !== -1) {
          this.groups[index] = updatedGroup; // Update UI
        }
      }
    });
  }

  deleteGroup(id?: number) {
    if (id === undefined) {
      console.error('❌ Invalid group ID:', id);
      return;
    }

    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(id).subscribe(
        () => {
          console.log('✅ Group deleted:', id);
          this.groups = this.groups.filter((group) => group.id !== id);
        },
        (error) => {
          console.error('❌ Error deleting group:', error);
        }
      );
    }
  }
}
