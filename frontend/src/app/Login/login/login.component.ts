import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginErrorDialogComponent } from './login-error-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, LoginErrorDialogComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {}

  onSubmit() {
    this.authService.login(this.login, this.password).subscribe(
      (response) => {
        // ✅ Successful login → Navigate to dashboard
        this.router.navigate(['/dashboard']).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        // ❌ Failed login → Show popup
        this.dialog.open(LoginErrorDialogComponent);
      }
    );
  }
}
