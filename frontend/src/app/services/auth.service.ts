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

    // Fetch the current user when service is initialized
    this.fetchCurrentUser().subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null) // If 401, reset user
    });
  }

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

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(login: string, password: string) {
    return this.http.post<any>('http://localhost:3000/api/auth/login', { login, password }, {
      withCredentials: true // Required for sessions!
    }).pipe(map(user => {
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  logout() {
    return this.http.post<any>('http://localhost:3000/api/auth/logout', {}, {
      withCredentials: true // Required for sessions!
    }).pipe(map(() => {
      this.currentUserSubject.next(null);
      return true;
    }));
  }
}
