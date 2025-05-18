import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
  private addApiUrl = 'http://localhost:3000/api/devices/addDevice'; 
  
  constructor(private http: HttpClient) {}

  getDevices(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { withCredentials: true });
  }

  createDevice(device: Device): Observable<any> {
    return this.http.post(`${this.addApiUrl}`, device, { withCredentials: true });
  }

  updateDevice(id: number, device: Device): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, device, { withCredentials: true });
  }

  deleteDevice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
  
  // New method to get device types from ENUM in database
  getDeviceTypes(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/types`, { withCredentials: true })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && Array.isArray(response.data)) {
            return response.data;
          }
          // Return default types if response format is unexpected
          return ['float', 'ORfloat', 'MIX'];
        })
      );
  }
}