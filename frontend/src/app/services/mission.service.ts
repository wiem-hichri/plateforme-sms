import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mission {
  id: number;
  type_mission: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = 'http://localhost:3000/api/missions'; // Adjust the URL to match your backend
  private addapiUrl = 'http://localhost:3000/api/addmission'; // Adjust the URL to match your backend


  constructor(private http: HttpClient) { }

  // Get all missions
  getMissions(): Observable<any> {
    return this.http.get<any>(this.apiUrl,{ withCredentials: true});
  }

  // Get mission by ID
  getMissionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`,{ withCredentials: true});
  }

  // Create new mission
  createMission(mission: { type_mission: string }): Observable<any> {
    return this.http.post<any>(this.addapiUrl, mission ,{ withCredentials: true });
  }

  // Update mission
  updateMission(id: number, mission: { type_mission: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mission ,{ withCredentials: true});
  }

  // Delete mission
  deleteMission(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`,{ withCredentials: true});
  }
}