import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listEvents(params: {
    actorId?: string; action?: string; targetType?: string; eventType?: string;
    dateFrom?: string; dateTo?: string; page?: number; size?: number;
  }): Observable<any> {
    let p = new HttpParams();
    if (params.actorId) p = p.set('actorId', params.actorId);
    if (params.action) p = p.set('action', params.action);
    if (params.targetType) p = p.set('targetType', params.targetType);
    if (params.eventType) p = p.set('eventType', params.eventType);
    if (params.dateFrom) p = p.set('dateFrom', params.dateFrom);
    if (params.dateTo) p = p.set('dateTo', params.dateTo);
    p = p.set('page', String(params.page ?? 0)).set('size', String(params.size ?? 20));
    return this.http.get(`${this.baseUrl}/admin/audit/events`, { params: p });
  }

  getEvent(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/audit/events/${eventId}`);
  }

  getRecentActivity(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/audit/recent`);
  }
}
