import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = 'http://localhost:3000/api/sites';

  constructor(private http: HttpClient) {}

  getSites(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
