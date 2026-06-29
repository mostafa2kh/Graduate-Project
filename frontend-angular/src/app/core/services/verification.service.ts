import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  submitKyc(data: any): Observable<any> { return this.http.post(`${this.base}/verification/me/submit`, data); }
  getStatus(): Observable<any> { return this.http.get(`${this.base}/verification/me/status`); }
  getMySubmissions(): Observable<any> { return this.http.get(`${this.base}/verification/me/submissions`); }
  uploadDocument(submissionId: string, file: File, documentType: string): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('documentType', documentType);
    return this.http.post(`${this.base}/verification/me/submissions/${submissionId}/documents`, fd);
  }
}
