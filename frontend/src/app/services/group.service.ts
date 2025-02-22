import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Group {
  id?: number;
  nom: string;
}

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/api/groupes'; // Fetch groups
  private addApiUrl = 'http://localhost:3000/api/addgroupes'; // Add group

  constructor(private http: HttpClient) {}

  getGroups(): Observable<{ status: string; data: Group[] }> {
    return this.http.get<{ status: string; data: Group[] }>('http://localhost:3000/api/groupes');
  }
  addGroup(group: Group): Observable<{ status: string; data: Group }> {
    return this.http.post<{ status: string; data: Group }>(this.apiUrl, group);
  }
  

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
