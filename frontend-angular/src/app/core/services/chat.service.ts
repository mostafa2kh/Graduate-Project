import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private api: ApiService) {}

  createThread(otherParticipantId: string, listingId?: string): Observable<any> {
    return this.api.post('/chat/threads', { otherParticipantId, listingId });
  }
  getMyThreads(): Observable<any> { return this.api.get('/chat/threads'); }
  getThreadDetail(threadId: string): Observable<any> { return this.api.get(`/chat/threads/${threadId}`); }
  getMessages(threadId: string): Observable<any> { return this.api.get(`/chat/threads/${threadId}/messages`); }
  sendMessage(threadId: string, content: string): Observable<any> {
    return this.api.post(`/chat/threads/${threadId}/messages`, { content });
  }
  markAsRead(threadId: string): Observable<any> { return this.api.post(`/chat/threads/${threadId}/read`); }
  getUnreadCount(): Observable<any> { return this.api.get('/chat/unread-count'); }
}
