import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService, Group } from '../../services/group.service';
import { AddGroupsDialogComponent } from '../add-groups-dialog/add-groups-dialog.component';
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
        console.log('Adding new group:', newGroup);
        this.groups.push(newGroup); // ✅ Immediately update UI
        this.fetchGroups(); // ✅ Ensure backend sync
      }
    });
  }
  

  deleteGroup(id?: number) {
    if (id === undefined) {
      console.error('Invalid group ID:', id);
      return; // Stop execution if ID is undefined
    }
  
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(id).subscribe(
        () => {
          this.groups = this.groups.filter((group) => group.id !== id);
        },
        (error) => {
          console.error('Error deleting group:', error);
        }
      );
    }
  }
  
}
