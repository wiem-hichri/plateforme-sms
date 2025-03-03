  import { Component } from '@angular/core';
  import { Router } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent {
    login: string = '';
    password: string = '';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
      this.authService.login(this.login, this.password).subscribe(
        (response) => {
          // Handle successful login
          this.router.navigate(['/dashboard']); // Redirect to dashboard or another route
        },
        (error) => {
          // Handle login error
          console.error('Login failed', error);
        }
      );
    }
  }
