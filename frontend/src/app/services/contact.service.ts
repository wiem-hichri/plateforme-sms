import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contacts';
  private addApiUrl = 'http://localhost:3000/api/addcontacts';
  private contactGroupeUrl = 'http://localhost:3000/contact-groupe';
  private phonesMatriculesUrl = 'http://localhost:3000/api/contacts/phones-matricules'; // New endpoint

  constructor(private http: HttpClient, private authService: AuthService) {}

  getContacts(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }

  addContact(contact: any): Observable<any> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.http.post<any>(this.addApiUrl, { userId, contact }, { withCredentials: true });
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, contact, { withCredentials: true });
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/groups', { withCredentials: true });
  }

  addMultipleContacts(contacts: Contact[]): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/import-contacts', contacts, { withCredentials: true });
  }

  associateContactsToGroup(contactIds: number[], groupId: number): Observable<any> {
    return this.http.post(`${this.contactGroupeUrl}/contacts/group`, { contactIds, groupId }, { withCredentials: true });
  }

  disassociateContactsFromGroup(contactIds: number[], groupId: number): Observable<any> {
    return this.http.delete(`${this.contactGroupeUrl}/delete`, { body: { contactIds, groupId }, withCredentials: true });
  }
  
  getContactsByGroup(groupId: number): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.contactGroupeUrl}/group/${groupId}/contacts`, { withCredentials: true });
  }

  // New method to fetch phone numbers and matricules by group ID
  getPhonesAndMatriculesByGroupId(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.phonesMatriculesUrl}/${groupId}`, { withCredentials: true });
  }
}
