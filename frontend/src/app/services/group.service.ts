import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Group {
  id?: number;
  nom: string;
}

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/api/groupes';
  private addApiUrl = 'http://localhost:3000/api/addgroupes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getGroups(): Observable<{ data: Group[] }> {
    return this.http.get<{ data: Group[] }>(this.apiUrl, { withCredentials: true });
  }

  addGroup(group: Group): Observable<{ data: Group }> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<{ data: Group }>(
      this.addApiUrl, 
      { userId, nom: group.nom }, // ✅ Fix request payload
      { withCredentials: true }
    );
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  updateGroup(group: Group): Observable<{ data: Group }> {
    return this.http.put<{ data: Group }>(
      `${this.apiUrl}/${group.id}`, 
      { nom: group.nom }, // ✅ Fix request payload
      { withCredentials: true }
    );
  }
}
