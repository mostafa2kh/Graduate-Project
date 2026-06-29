import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe, SlicePipe } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, SlicePipe, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <div class="page-header"><h1 class="page-title">Payment History</h1><p class="page-subtitle">View your payment transactions</p></div>

      @if (loading) { <app-skeleton type="table-row" /> }
      @else if (payments.length === 0) { <app-empty-state icon="folder" title="No payments yet" message="Complete a booking to make a payment." /> }
      @else {
        <div class="table-wrapper">
          <table class="payment-table">
            <thead><tr><th>Booking</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              @for (p of payments; track p.id) {
                <tr>
                  <td class="text-muted">{{ p.bookingId | slice:0:8 }}...</td>
                  <td>{{ p.currency || '$' }}{{ p.amount?.toLocaleString() }}</td>
                  <td>{{ p.paymentMethod }}</td>
                  <td><app-badge [variant]="statusVariant(p.status)">{{ p.status }}</app-badge></td>
                  <td class="text-muted">{{ p.paidAt || p.createdAt | date:'medium' }}</td>
                  <td><a [routerLink]="['..', p.id]" class="btn-outline btn-sm">View</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .page-header { margin-bottom: $space-6; }
    .page-title { font-size: $text-2xl; font-weight: 800; }
    .page-subtitle { font-size: $text-sm; color: $text-muted; margin-top: $space-1; }
    .table-wrapper { background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; overflow-x: auto; }
    .payment-table { width: 100%; border-collapse: collapse; }
    .payment-table th, .payment-table td { padding: $space-3 $space-4; text-align: left; font-size: $text-sm; border-bottom: 1px solid $card-border; white-space: nowrap; }
    .payment-table th { font-weight: 600; color: $text-muted; text-transform: uppercase; font-size: $text-xs; background: $bg-light; }
    .payment-table tr:last-child td { border-bottom: none; }
    .payment-table tr:hover td { background: $bg-light; }
    .text-muted { color: $text-muted; }
  `]
})
export class PaymentHistoryComponent implements OnInit {
  payments: any[] = []; loading = true;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getMyPayments().subscribe({
      next: (res: any) => { const d = res.data || res; this.payments = d.content || d.items || d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  statusVariant(s: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
    switch (s) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'danger';
      case 'REFUNDED': return 'neutral';
      default: return 'primary';
    }
  }
}
