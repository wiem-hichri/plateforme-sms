import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private apiUrl = 'http://localhost:3000/api'; // Update if needed

  constructor(private http: HttpClient) {}

  sendSMS(destinationNumber: string, textDecoded: string, creatorId: number) {
    return this.http.post(
      `${this.apiUrl}/insert`,
      { destinationNumber, textDecoded, creatorId },
      { withCredentials: true }
    ).toPromise();
  }

  getCount() {
    return this.http.get(
      `${this.apiUrl}/count`,
      { withCredentials: true }
    ).toPromise();
  }

  getRecentSMS() {
    return this.http.get(
      `${this.apiUrl}/recent`,
      { withCredentials: true }
    ).toPromise();
  }

  deleteSMS() {
    return this.http.delete(
      `${this.apiUrl}/delete`,
      { withCredentials: true }
    ).toPromise();
  }

  markAsSent() {
    return this.http.post(
      `${this.apiUrl}/sent`,
      {},
      { withCredentials: true }
    ).toPromise();
  }
}
