import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private api: ApiService) {}

  getNotifications(page = 0, size = 20): Observable<any> { return this.api.get(`/notifications?page=${page}&size=${size}`); }
  getUnreadCount(): Observable<any> { return this.api.get('/notifications/unread-count'); }
  markAsRead(id: string): Observable<any> { return this.api.post(`/notifications/${id}/read`); }
  markAllAsRead(): Observable<any> { return this.api.post('/notifications/read-all'); }
  getPreferences(): Observable<any> { return this.api.get('/notifications/preferences'); }
  updatePreferences(data: any): Observable<any> { return this.api.put('/notifications/preferences', data); }
}
