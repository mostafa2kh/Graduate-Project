import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ListingRequest, ListingSummary, ListingDetail, AmenityItem, StatusHistoryItem } from '../models/listing.models';

@Injectable({ providedIn: 'root' })
export class ListingService {

  constructor(private api: ApiService) {}

  createDraft(data: ListingRequest): Observable<any> {
    return this.api.post<ListingDetail>('/listings', data);
  }

  getMyListings(page = 0, size = 10): Observable<any> {
    return this.api.get<any>(`/listings/my?page=${page}&size=${size}`);
  }

  getMyListingDetails(id: string): Observable<any> {
    return this.api.get<ListingDetail>(`/listings/my/${id}`);
  }

  updateListing(id: string, data: ListingRequest): Observable<any> {
    return this.api.put<ListingDetail>(`/listings/${id}`, data);
  }

  deleteDraft(id: string): Observable<any> {
    return this.api.delete(`/listings/${id}`);
  }

  submitForReview(id: string): Observable<any> {
    return this.api.post<ListingDetail>(`/listings/${id}/submit`);
  }

  getStatusHistory(id: string): Observable<any> {
    return this.api.get<StatusHistoryItem[]>(`/listings/${id}/status-history`);
  }

  getAmenities(): Observable<any> {
    return this.api.get<AmenityItem[]>('/listings/amenities');
  }

  updateAvailability(id: string, availability: any[]): Observable<any> {
    return this.api.put<ListingDetail>(`/listings/${id}/availability`, availability);
  }
}
