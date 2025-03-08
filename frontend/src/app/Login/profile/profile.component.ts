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

  profileForm: FormGroup = this.fb.group({
    matricule: [{ value: '', disabled: true }],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    login: [{ value: '', disabled: true }],
    email: ['', [Validators.required, Validators.email]],
    role: [{ value: '', disabled: true }]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  showPasswords = { current: false, new: false, confirm: false };

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.http.get<any>('http://localhost:3000/api/users/:id').subscribe(
      (data) => this.profileForm.patchValue(data),
      (error) => console.error('Error fetching profile:', error)
    );
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.http.put('http://localhost:3000/api/users/1', this.profileForm.value).subscribe(
        () => console.log('Profile Updated'),
        (error) => console.error('Error updating profile:', error)
      );
    }
  }

  changePassword() {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (this.passwordForm.valid && newPassword === confirmPassword) {
      const userId = 1; // Replace with the actual user ID
      const { currentPassword } = this.passwordForm.value;
      this.userService.updatePassword(userId, currentPassword, newPassword, confirmPassword).subscribe(
        () => console.log('Password Updated Successfully'),
        (error) => console.error('Error updating password:', error)
      );
    } else {
      console.log('Passwords do not match');
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    this.showPasswords[field] = !this.showPasswords[field];
  }
}
