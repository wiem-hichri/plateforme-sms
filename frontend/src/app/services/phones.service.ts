// phones.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhonesService {

  private apiUrl = 'http://localhost:3000/api/phones-by-matricules';  // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  getPhoneNumbersByMatricules(matricules: string[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, { matricules });
  }
}
