import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  login: string;
  password?: string; // Optional if not always provided
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private addApiUrl = 'http://localhost:3000/api/addusers';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(this.apiUrl,{withCredentials: true });
  }

  addUser(user: User): Observable<{ data: User }> {
    return this.http.post<{ data: User }>(this.addApiUrl, user,{withCredentials: true });
  }

  updateUser(id: number, user: User): Observable<{ data: User }> {
    return this.http.put<{ data: User }>(`${this.apiUrl}/${id}`, user,{withCredentials: true });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{withCredentials: true });
  }
  
  updatePassword(id: number, oldPassword: string, newPassword: string, confirmPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/password/${id}`, { oldPassword, newPassword, confirmPassword },{withCredentials: true });
  }
}
