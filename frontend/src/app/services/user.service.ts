import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  login: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Ensure this matches your backend
  private addApiUrl = 'http://localhost:3000/api/addusers'; // Consistent with groups

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(this.apiUrl);
  }

  addUser(user: User): Observable<{ data: User }> {
    return this.http.post<{ data: User }>(this.addApiUrl, user); 
  }
  

  updateUser(id: number, user: User): Observable<{ data: User }> {
    return this.http.put<{ data: User }>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
