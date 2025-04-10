import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PuceService {
  private apiUrl = 'http://localhost:3000/api/puces';
  private addApiUrl = 'http://localhost:3000/api/addpuce';
  private contactsUrl = 'http://localhost:3000/api/contacts';
  private missionsUrl = 'http://localhost:3000/api/missions';

  constructor(private http: HttpClient) {}

  getPuces(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  createPuce(puce: any): Observable<any> {
    return this.http.post<any>(this.addApiUrl, puce, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  updatePuce(id: number, puce: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, puce, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  supprimerPuce(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  getContacts(): Observable<any> {
    return this.http.get<any>(this.contactsUrl, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  getMissions(): Observable<any> {
    return this.http.get<any>(this.missionsUrl, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
