import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ImageResponse {
  imageId: string;
  mediaFileId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  isPrimary: boolean;
  sortOrder: number;
  url: string;
  provider: string;
  createdAt: string;
}

export interface ImageUploadResult {
  imageId: string;
  mediaFileId: string;
  fileName: string;
  url: string;
}

export interface ImageValidation {
  currentCount: number;
  minRequired: number;
  maxAllowed: number;
  meetsMinimum: boolean;
  exceedsMaximum: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImages(listingId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return this.http.post(`${this.baseUrl}/media/listings/${listingId}/images`, formData);
  }

  getListingImages(listingId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/media/listings/${listingId}/images`);
  }

  deleteImage(imageId: string, listingId: string): Observable<any> {
    const params = new HttpParams().set('listingId', listingId);
    return this.http.delete(`${this.baseUrl}/media/images/${imageId}`, { params });
  }

  setPrimaryImage(listingId: string, imageId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/media/listings/${listingId}/images/${imageId}/primary`, {});
  }

  getValidation(listingId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/media/listings/${listingId}/validation`);
  }

  getFileUrl(fileId: string): string {
    return `${this.baseUrl}/media/files/${fileId}`;
  }

  getReview(listingId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ai-review/listings/${listingId}`);
  }

  getReviewFlags(listingId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ai-review/listings/${listingId}/flags`);
  }

  triggerReview(listingId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai-review/listings/${listingId}/review`, {});
  }
}
