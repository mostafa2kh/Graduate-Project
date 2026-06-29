import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private api: ApiService) {}

  getPaymentSummary(bookingId: string): Observable<any> { return this.api.get(`/payments/bookings/${bookingId}/summary`); }
  mockPay(bookingId: string): Observable<any> { return this.api.post(`/payments/bookings/${bookingId}/mock-pay`); }
  getPayment(paymentId: string): Observable<any> { return this.api.get(`/payments/${paymentId}`); }
  getMyPayments(page = 0, size = 10): Observable<any> { return this.api.get(`/payments/my?page=${page}&size=${size}`); }
}
