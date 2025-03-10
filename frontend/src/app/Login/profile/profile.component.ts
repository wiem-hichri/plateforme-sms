import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
  private http = inject(HttpClient);
  private userService = inject(UserService);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  showPasswords = { current: false, new: false, confirm: false };

  constructor() {
    // Initialize forms
    this.profileForm = this.fb.group({
      matricule: [{ value: '', disabled: true }],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      login: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
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

  // Load user profile data
  loadProfile(): void {
    const userId = 1;  // Replace with actual user ID
    this.http.get<any>(`http://localhost:3000/api/auth/current-user`).subscribe(
      data => this.profileForm.patchValue(data),
      error => console.error('Error fetching profile:', error)
    );
  }

  // Update user profile
  updateProfile(): void {
    if (this.profileForm.valid) {
      const userId = 1;  // Replace with actual user ID
      this.http.put(`http://localhost:3000/api/auth/current-user`, this.profileForm.value).subscribe(
        () => console.log('Profile updated successfully'),
        error => console.error('Error updating profile:', error)
      );
    }
  }

  // Change password
  changePassword(): void {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (this.passwordForm.valid && newPassword === confirmPassword) {
      const userId = 1;  // Replace with actual user ID
      const { currentPassword } = this.passwordForm.value;
      this.userService.updatePassword(userId, currentPassword, newPassword, confirmPassword).subscribe(
        () => console.log('Password updated successfully'),
        error => console.error('Error updating password:', error)
      );
    } else {
      console.log('Passwords do not match');
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.showPasswords[field] = !this.showPasswords[field];
  }
}
