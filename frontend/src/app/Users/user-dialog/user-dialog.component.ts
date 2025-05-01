  import { Component } from '@angular/core';
  import { MatDialog, MatDialogRef } from '@angular/material/dialog';
  import { UserService, User } from '../../services/user.service';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { PasswordPopupComponent } from '../password-popup/password-popup.component';

  @Component({
    selector: 'app-add-user-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss']
  })
  export class AddUserDialogComponent {
    newUser: User = {
      matricule: '',
      nom: '',
      prenom: '',
      login: '',
      role: ''
    };

    constructor(
      public dialogRef: MatDialogRef<AddUserDialogComponent>,
      private userService: UserService,
      private dialog: MatDialog
    ) {}

    closeDialog() {
      this.dialogRef.close();
    }

    addUser() {
      if (this.newUser.matricule && this.newUser.nom) {
        this.userService.addUser(this.newUser).subscribe(
          (response) => {
            console.log('✅ User added successfully:', response);
      
            // Close the add user dialog
            this.dialogRef.close(response?.data || this.newUser);
          },
          (error) => {
            console.error('❌ Error adding user:', error);
          }
        );
      }
    }


    



  }

  