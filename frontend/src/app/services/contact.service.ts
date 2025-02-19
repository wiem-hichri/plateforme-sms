import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ Makes the service available globally
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contacts'; // ✅ Ensure this is correct

  constructor(private http: HttpClient) {} // ✅ HttpClient is correctly injected

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
