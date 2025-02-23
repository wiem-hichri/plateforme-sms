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
  private apiUrl = 'http://localhost:3000/api/groupes';
  private addApiUrl = 'http://localhost:3000/api/addgroupes';


  constructor(private http: HttpClient) {}

  getGroups(): Observable<{ data: Group[] }> {
    return this.http.get<{ data: Group[] }>(this.apiUrl);
  }

  addGroup(group: Group): Observable<{ data: Group }> {
    return this.http.post<{ data: Group }>(this.addApiUrl, group);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
