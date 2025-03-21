import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // ✅ Import map operator

@Injectable({
  providedIn: 'root'
})
export class SmsModelService {
  private apiUrl = 'http://localhost:3000/api/models';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}`, { withCredentials: true })
      .pipe(map(response => response.data)); // ✅ Extract 'data' if it's inside an object
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(map(response => response.data)); // ✅ Extract 'data'
  }

  create(model: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, model, { withCredentials: true });
  }

  update(id: number, model: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, model, { withCredentials: true });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
