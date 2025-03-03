  import { Injectable } from '@angular/core';
  import { CanActivate, Router } from '@angular/router';
  import { AuthService } from './services/auth.service';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        // logged in, return true
        return true;
      } else {
        // not logged in, redirect to login page
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
