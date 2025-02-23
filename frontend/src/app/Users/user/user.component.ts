import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  expandedUserId: number | null = null; // Track clicked user

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  toggleDetails(userId: number) {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }

  deleteUser(id?: number) {
    if (id === undefined) return;

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(user => user.id !== id);
      });
    }
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newUser: User | undefined) => {
      if (newUser) {
        this.users.push(newUser);
      }
    });
  }
}
