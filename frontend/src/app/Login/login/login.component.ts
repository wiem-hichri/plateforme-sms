import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: string = '';
  password: string = '';
  showPopup: boolean = false;
  popupMessage: string = '';
  expired: boolean = false;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {}

  onSubmit() {
    this.authService.login(this.login, this.password).subscribe(
      (response) => {
        if (response.expired || response.warning) {
          this.showPopup = true;
          this.popupMessage = response.expired
            ? "Votre mot de passe a expiré. Veuillez le réinitialiser."
            : response.warning;
          this.expired = response.expired;

          if (response.expired) {
            return;
          }
        }

        this.router.navigate(['/dashboard']).then(() => window.location.reload());
      },
      (error) => {
        this.showPopup = true;
        this.popupMessage = "Login ou mot de passe incorrect.";
        this.expired = false;
      }
    );
  }

  closePopup() {
    this.showPopup = false;
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}