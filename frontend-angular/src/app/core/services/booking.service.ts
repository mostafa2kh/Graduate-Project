import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private api: ApiService) {}

  createBooking(data: any): Observable<any> { return this.api.post('/bookings', data); }
  getMyBookings(page = 0, size = 10): Observable<any> { return this.api.get(`/bookings/my?page=${page}&size=${size}`); }
  getLandlordBookings(page = 0, size = 10): Observable<any> { return this.api.get(`/bookings/landlord?page=${page}&size=${size}`); }
  getBookingDetail(id: string): Observable<any> { return this.api.get(`/bookings/${id}`); }
  acceptBooking(id: string): Observable<any> { return this.api.post(`/bookings/${id}/accept`); }
  rejectBooking(id: string, reason: string): Observable<any> { return this.api.post(`/bookings/${id}/reject`, { reason }); }
  cancelBooking(id: string): Observable<any> { return this.api.post(`/bookings/${id}/cancel`); }
  checkAvailability(listingId: string, startDate: string, endDate: string): Observable<any> {
    return this.api.get(`/bookings/listings/${listingId}/availability-check?startDate=${startDate}&endDate=${endDate}`);
  }
}
