import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe, SlicePipe } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { BookingService } from '../../core/services/booking.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, SlicePipe, BadgeComponent, SkeletonComponent],
  template: `
    <div class="container" style="padding: 2rem 0; max-width: 600px;">
      <h1 class="page-title">Complete Payment</h1>
      <p class="page-subtitle">This is a mock payment simulation. No real money will be charged.</p>

      @if (loading) { <app-skeleton type="card" /> }
      @else if (paid) {
        <div class="success-card">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2>Payment Successful!</h2>
          <p>Your mock payment has been processed. Transaction ref: <strong>{{ payment?.stripePaymentIntentId }}</strong></p>
          <div class="actions"><a routerLink="/dashboard/bookings" class="btn-primary">Back to Bookings</a></div>
        </div>
      } @else {
        <div class="card">
          <div class="card-body" style="padding: $space-6">
            <div class="summary-row"><span>Booking</span><strong>{{ bookingId | slice:0:8 }}...</strong></div>
            <div class="summary-row"><span>Amount</span><strong>{{ currency || '$' }}{{ amount }}</strong></div>
            <div class="summary-row"><span>Method</span><strong>Stripe (Mock)</strong></div>
          </div>
        </div>

        <div class="mock-notice">
          <strong>Mock Payment Notice</strong>
          <p>This is a simulated payment for demonstration purposes. No credit card details are collected or processed. Click "Pay Now" to simulate a successful payment.</p>
        </div>

        <button class="btn-primary" style="width: 100%; margin-top: 1rem;" (click)="pay()" [disabled]="paying">
          {{ paying ? 'Processing...' : 'Pay Now - Mock Payment' }}
        </button>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .page-title { font-size: $text-2xl; font-weight: 800; margin-bottom: $space-1; }
    .page-subtitle { font-size: $text-sm; color: $text-muted; margin-bottom: $space-8; }
    .card { background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; }
    .summary-row { display: flex; justify-content: space-between; padding: $space-3 0; border-bottom: 1px solid $card-border; &:last-child { border-bottom: none; } span { color: $text-muted; font-size: $text-sm; } strong { font-size: $text-base; } }
    .mock-notice { background: $warning-bg; border: 1px solid $warning; border-radius: $radius-md; padding: $space-4; margin-top: $space-6; font-size: $text-sm; strong { display: block; margin-bottom: $space-1; } p { color: $text-muted; } }
    .success-card { text-align: center; padding: $space-12; }
    .success-icon { width: 64px; height: 64px; margin: 0 auto $space-4; color: $success; }
    .actions { margin-top: $space-6; }
  `]
})
export class PaymentCheckoutComponent implements OnInit {
  bookingId = ''; amount = 0; currency = 'USD';
  payment: any = null; loading = true; paying = false; paid = false;

  constructor(private route: ActivatedRoute, private router: Router, private paymentService: PaymentService, private bookingService: BookingService, private toast: ToastService) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    this.paymentService.getPaymentSummary(this.bookingId).subscribe({
      next: (res: any) => { const d = res.data || res; this.amount = d.amount; this.currency = d.currency; this.loading = false; if (d.paymentStatus === 'COMPLETED') this.paid = true; },
      error: () => this.loading = false
    });
  }

  pay(): void {
    this.paying = true;
    this.paymentService.mockPay(this.bookingId).subscribe({
      next: (res: any) => { this.payment = res.data || res; this.paid = true; this.paying = false; this.toast.show('Payment successful!', 'success'); },
      error: (err) => { this.toast.show(err.message || 'Payment failed', 'error'); this.paying = false; }
    });
  }
}
