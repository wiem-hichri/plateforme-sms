import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService, Group } from '../../services/group.service';
import { AddGroupsDialogComponent } from '../add-groups-dialog/add-groups-dialog.component';
import { MatTableModule } from '@angular/material/table'; // ✅ Import MatTableModule
import { MatButtonModule } from '@angular/material/button'; // ✅ Button Module
import { MatIconModule } from '@angular/material/icon'; // ✅ Icons Module
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, // ✅ Ensure MatTableModule is imported
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'action'];
  groups: Group[] = [];

  constructor(private groupService: GroupService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchGroups();
  }
  fetchGroups() {
    this.groupService.getGroups().subscribe(
      (response) => {
        console.log('Groups fetched:', response);
        
        // ✅ Extract the array from response.data
        if (response && Array.isArray(response.data)) { 
          this.groups = response.data; 
        } else {
          console.error('API response does not contain an array:', response);
          this.groups = []; // Set an empty array to avoid errors
        }
      },
      (error) => {
        console.error('Error fetching groups:', error);
        this.groups = []; // Set an empty array if API call fails
      }
    );
  }
  

  openAddGroupModal() {
    const dialogRef = this.dialog.open(AddGroupsDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newGroup) => {
      if (newGroup) {
        this.fetchGroups(); // Refresh groups after adding
      }
    });
  }

  deleteGroup(id: number) {
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
