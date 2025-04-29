// sms-generator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface SmsResponse {
  message: string;
  conversationHistory: Message[];
}

@Injectable({
  providedIn: 'root'
})
export class SmsGeneratorService {
  private apiUrl = 'http://localhost:3000/api/generate-sms-claud';

  constructor(private http: HttpClient) {}

  generateSms(prompt: string): Observable<SmsResponse> {
    return this.http.post<SmsResponse>(this.apiUrl, { prompt, withCredentials: true } );
  }
}
