import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/dashboard/stats`);
  }

  getPendingListings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/listings/pending`);
  }

  getModerationDetail(listingId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/listings/${listingId}/review`);
  }

  approveListing(listingId: string, note?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/listings/${listingId}/approve`, { note: note || '' });
  }

  rejectListing(listingId: string, reason: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/listings/${listingId}/reject`, { reason });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/users`);
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/users/${userId}`);
  }

  disableUser(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users/${userId}/disable`, {});
  }

  enableUser(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users/${userId}/enable`, {});
  }

  getKycSubmissions(): Observable<any> { return this.http.get(`${this.baseUrl}/admin/verification/submissions`); }
  getKycSubmissionDetail(id: string): Observable<any> { return this.http.get(`${this.baseUrl}/admin/verification/submissions/${id}`); }
  approveKyc(id: string): Observable<any> { return this.http.post(`${this.baseUrl}/admin/verification/submissions/${id}/approve`, {}); }
  rejectKyc(id: string, reason: string): Observable<any> { return this.http.post(`${this.baseUrl}/admin/verification/submissions/${id}/reject`, { reason }); }
}
