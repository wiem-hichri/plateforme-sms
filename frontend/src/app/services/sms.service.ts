import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private apiUrl = 'http://localhost:3000/api'; // Update if needed

  constructor(private http: HttpClient) {}

  sendSMS(destinationNumber: string, textDecoded: string, senderID: number, modeleId: number | null) {
    return this.http.post(
      `${this.apiUrl}/insert`,
      { destinationNumber, textDecoded, senderID, modeleId },
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
  generateSMS(data: {
    template: string;
    contactMatricule: string;
    modeleId?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/models/generate-sms`, data);
  }

  // Send message to a group
  sendMessageToGroup(groupId: number, data: { modeleId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/models/group/${groupId}`, data);
  }

  // Send confidential message with Excel file
  sendConfidentialMessage(modeleId: number, groupId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/models/messageConfidentiel/${modeleId}/${groupId}`, formData);
  }

  // Send actual SMS (implementation would depend on your backend)
  SendSMS(recipientNumber: string, messageContent: string, senderID: number): Observable<any> {
    const payload = {
      destinationNumber: recipientNumber,
      content: messageContent,
      senderID: senderID
    };
    return this.http.post(`${this.apiUrl}/sms/send`, payload);
  }

  // Send bulk messages
  sendMessages(messages: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/sms/send-bulk`, { messages });
  }
}
