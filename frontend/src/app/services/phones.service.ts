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
  
  // Map the response data to use the preferred phone number
  mapPhoneResponse(response: any): any {
    if (response && response.data) {
      // Ensure each contact has the 'telephone' property which contains the appropriate phone number
      return {
        ...response,
        data: response.data.map((contact: any) => {
          return {
            ...contact,
            // The backend now returns the 'telephone' field with the appropriate number
            // This ensures backward compatibility with older component usage
            telephone_professionnel: contact.telephone || contact.telephone_professionnel
          };
        })
      };
    }
    return response;
  }
}