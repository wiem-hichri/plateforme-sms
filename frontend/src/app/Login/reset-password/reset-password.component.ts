import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  login: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPopup: boolean = false;
  popupMessage: string = '';
  popupIsError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Validate passwords match
    if (this.newPassword !== this.confirmPassword) {
      this.showPopup = true;
      this.popupMessage = "Les mots de passe ne correspondent pas";
      this.popupIsError = true;
      return;
    }

    this.authService.resetPassword(
      this.login, 
      this.oldPassword, 
      this.newPassword, 
      this.confirmPassword
    ).subscribe(
      (response) => {
        this.showPopup = true;
        this.popupMessage = "Mot de passe mis à jour avec succès";
        this.popupIsError = false;
      },
      (error) => {
        this.showPopup = true;
        this.popupMessage = error.error?.message || "Erreur lors de la réinitialisation du mot de passe";
        this.popupIsError = true;
      }
    );
  }

  closePopup() {
    this.showPopup = false;
    if (!this.popupIsError) {
      this.router.navigate(['/login']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}