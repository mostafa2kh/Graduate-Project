import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingReviewService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createReview(bookingId: string, data: { rating: number; comment?: string }): Observable<any> {
    return this.http.post(`${this.base}/bookings/${bookingId}/review`, data);
  }

  getListingReviews(listingId: string): Observable<any> {
    return this.http.get(`${this.base}/bookings/listings/${listingId}/reviews`);
  }

  getBookingReview(bookingId: string): Observable<any> {
    return this.http.get(`${this.base}/bookings/${bookingId}/review`);
  }
}
