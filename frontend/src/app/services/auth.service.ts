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

  /** ✅ Get the role of the currently logged-in user */
  getCurrentUserRole(): string {
    return this.currentUserValue?.role || '';
  }

  /** ✅ Fetch the current user from the backend */
  fetchCurrentUser() {
    return this.http.get<any>('http://localhost:3000/api/auth/current-user', {
      withCredentials: true // Required for sessions!
    }).pipe(
      map(user => {
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  /** ✅ Login method */
  login(login: string, password: string) {
    return this.http.post<any>('http://localhost:3000/api/auth/login', { login, password }, {
      withCredentials: true
    }).pipe(map(user => {
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  /** ✅ Logout method */
  logout() {
    return this.http.post<any>('http://localhost:3000/api/auth/logout', {}, {
      withCredentials: true
    }).pipe(map(() => {
      this.currentUserSubject.next(null);
      return true;
    }));
  }
}
