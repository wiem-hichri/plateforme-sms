import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model'; // ✅ Import the Contact model


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contacts'; // ✅ Your backend API URL
 private addapiUrl = 'http://localhost:3000/api/addcontacts';
  constructor(private http: HttpClient)   {}

  getContacts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // ✅ Ensure this function is included
  addContact(contact: any): Observable<any> {
    return this.http.post<any>(this.addapiUrl, contact,{
      withCredentials: true 
    })
  }
  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, contact,{
      withCredentials: true 
    }); // ✅ Use ID instead of matricule
  }
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{
      withCredentials: true 
    }); // ✅ Uses ID instead of matricule
  }
  getGroupes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/groupes',{
      withCredentials: true 
    }); // ✅ Adjust API URL if needed
  }
  
  
}
