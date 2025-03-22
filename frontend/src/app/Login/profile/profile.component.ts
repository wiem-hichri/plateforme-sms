import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  showPasswords = { current: false, new: false, confirm: false };

  constructor() {
    this.profileForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      matricule: [{ value: '', disabled: true }],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      login: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.fetchCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.profileForm.patchValue({
            id: user.id,
            matricule: user.matricule,
            nom: user.nom,
            prenom: user.prenom,
            login: user.login,
            email: user.email,
            role: user.role
          });
        }
      },
      (error) => console.error('Error fetching profile:', error)
    );
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const updatedUser = this.profileForm.getRawValue();
      const userId = updatedUser.id;

      if (!userId) {
        console.error('User ID is missing!');
        return;
      }

      this.userService.updateUser(userId, updatedUser).subscribe(
        () => {
          console.log('Profile updated successfully');
          alert('Profile updated successfully!');
        },
        (error) => {
          console.error('Error updating profile:', error);
          alert('Error updating profile');
        }
      );
    }
  }

  changePassword(): void {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (this.passwordForm.valid && newPassword === confirmPassword) {
      this.authService.currentUser.subscribe(user => {
        if (user) {
          this.userService.updatePassword(user.id, currentPassword, newPassword, confirmPassword).subscribe(
            () => {
              console.log('Password updated successfully');
              alert('Password changed successfully!');
            },
            (error) => console.error('Error updating password:', error)
          );
        }
      });
    } else {
      console.log('Passwords do not match');
      alert('Passwords do not match');
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.showPasswords[field] = !this.showPasswords[field];
  }
}
