import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(message: string, listingId?: string, conversationId?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai-chatbot/messages`, { message, listingId, context: conversationId });
  }

  getHistory(conversationId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ai-chatbot/conversations/${conversationId}`);
  }

  clearHistory(conversationId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ai-chatbot/conversations/${conversationId}`);
  }
}
