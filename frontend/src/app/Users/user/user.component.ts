import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService, User } from '../../services/user.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  expandedUserId: number | null = null;
  filterValue: string = '';

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.users = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.users = response.data;
        } else {
          console.warn('Unexpected API response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching Users:', error);
      }
    );
  }

  get filteredUsers(): User[] {
    if (!this.filterValue) {
      return this.users;
    }
    return this.users.filter(user =>
      user.nom.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      user.prenom.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      user.matricule.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }

  toggleDetails(userId: number) {
    if (userId !== undefined) {
      this.expandedUserId = this.expandedUserId === userId ? null : userId;
    }
  }

  deleteUser(id?: number) {
    if (id === undefined) return;

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.fetchUsers(); // Refresh the user list
      });
    }
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newUser: User | undefined) => {
      if (newUser) {
        this.userService.addUser(newUser).subscribe(() => {
          this.fetchUsers(); // Refresh the user list
        });
      }
    });
  }

  openEditUserDialog(user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe((updatedUser: User | undefined) => {
      if (updatedUser) {
        this.userService.updateUser(updatedUser.id!, updatedUser).subscribe(() => {
          this.fetchUsers(); // Refresh the user list
        });
      }
    });
  }
}
