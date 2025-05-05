import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Device {
  id?: number;
  nom: string;
  proprietaire: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:3000/api/devices'; 
  private addapiUrl = 'http://localhost:3000/api/devices/addMission'; 
  constructor(private http: HttpClient) {}

  getDevices(): Observable<any> {
    return this.http.get(`${this.apiUrl}`,{ withCredentials: true});
  }

  createDevice(device: Device): Observable<any> {
    return this.http.post(`${this.apiUrl}`, device,{ withCredentials: true});
  }

  updateDevice(id: number, device: Device): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, device,{ withCredentials: true});
  }

  deleteDevice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{ withCredentials: true});
  }
}