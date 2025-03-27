import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model'; 
import { AuthService } from './auth.service'; // ✅ Import AuthService

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contacts';  
  private addapiUrl = 'http://localhost:3000/api/addcontacts';
  private Url = 'http://localhost:3000/contact-groupe';  


  constructor(private http: HttpClient, private authService: AuthService) {} // ✅ Inject AuthService

  getContacts(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }

  // ✅ Fixed: Use 'this.authService' instead of 'this.AuthService'
  addContact(contact: any): Observable<any> {
    const userId = this.authService.getCurrentUserId(); // ✅ Correct usage

    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<any>(this.addapiUrl, { userId, contact }, { withCredentials: true });
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, contact, { withCredentials: true });
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getGroupes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/groupes', { withCredentials: true });
  }

  addMultipleContacts(contacts: Contact[]): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/import-contacts', contacts, { withCredentials: true });
  }
  associateContactToGroups(contactId: number, groupIds: number[]): Observable<any> {
    return this.http.post(`${this.Url}/contacts/${contactId}/groups`, { groupIds });
  }
}
