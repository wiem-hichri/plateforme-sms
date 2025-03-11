import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { PasswordPopupComponent } from '../password-popup/password-popup.component';
import { AuthService } from '../../services/auth.service';

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
  loggedInUserRole: string = '';

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.loggedInUserRole = this.normalizeRole(user?.role);
    });

    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = (Array.isArray(response) ? response : response?.data || [])
          .filter(user => this.normalizeRole(user.role) !== 'super-administrateur'); // ✅ HIDE SUPER ADMINS HERE-
      },
      (error) => console.error('Error fetching Users:', error)
    );
  }

  /** ✅ Normalize role names to avoid case/whitespace issues */
  private normalizeRole(role: string | undefined): string {
    return role ? role.trim().toLowerCase() : '';
  }

  /** ✅ Apply filtering (Super Admins are already removed in fetchUsers) */
  get filteredUsers(): User[] {
    return this.users.filter(user =>
      user.nom.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      user.prenom.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      user.matricule.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }

  toggleDetails(userId: number) {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }

  deleteUser(id?: number) {
    if (id !== undefined && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => this.fetchUsers());
    }
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(EditUserComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe((newUser: User | undefined) => {
      if (newUser) {
        this.userService.addUser(newUser).subscribe(() => this.fetchUsers());
      }
    });
  }

  openEditUserDialog(user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, { width: '400px', data: user });

    dialogRef.afterClosed().subscribe((updatedUser: User | undefined) => {
      if (updatedUser) {
        this.userService.updateUser(updatedUser.id!, updatedUser).subscribe(() => this.fetchUsers());
      }
    });
  }

  openPasswordPopup(user: User) {
    this.dialog.open(PasswordPopupComponent, {
      width: '300px',
      data: { matricule: user.matricule, password: user.password }
    });
  }

  /** ✅ Restrict password viewing for Admins */
  canViewPassword(user: User): boolean {
    const userRole = this.normalizeRole(user.role);
    return !(
      this.loggedInUserRole === 'administrateur' && 
      (userRole === 'administrateur' || userRole === 'super administrateur')
    );
  }
}
