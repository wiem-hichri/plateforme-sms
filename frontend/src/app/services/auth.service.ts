import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Fetch the current user when the service initializes
    this.fetchCurrentUser().subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null) // Reset user if unauthorized
    });
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  /** Get the role of the currently logged-in user */
  getCurrentUserRole(): string {
    return this.currentUserValue?.role || '';
  }
  
  /** Get the ID of the currently logged-in user */
  getCurrentUserId(): number | null {
    return this.currentUserValue?.id || null;
  }

  /** Fetch the current user from the backend */
  fetchCurrentUser() {
    return this.http.get<any>(`${this.apiUrl}/auth/current-user`, {
      withCredentials: true // Required for sessions!
    }).pipe(
      map(user => {
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  /** Login method */
  login(login: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { login, password }, {
      withCredentials: true
    }).pipe(map(user => {
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  /** Logout method */
  logout() {
    return this.http.post<any>(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(map(() => {
      this.currentUserSubject.next(null);
      return true;
    }));
  }

  /** Reset password method - does not require authentication */
  resetPassword(login: string, oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, { 
      login, 
      oldPassword, 
      newPassword, 
      confirmPassword 
    });
  }
}