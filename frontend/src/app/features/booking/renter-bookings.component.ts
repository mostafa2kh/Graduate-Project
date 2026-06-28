import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { LookupService } from '../../core/services/lookup.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-renter-bookings',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <div class="page-header"><h1 class="page-title">My Bookings</h1><p class="page-subtitle">Manage your rental bookings</p></div>

      @if (loading) { <app-skeleton type="table-row" /> }
      @else if (bookings.length === 0) { <app-empty-state icon="folder" title="No bookings yet" message="Book a listing to get started." /> }
      @else {
        <div class="table-wrapper">
          <table class="booking-table">
            <thead><tr><th>Listing</th><th>Landlord</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              @for (b of bookings; track b.id) {
                <tr>
                  <td class="listing-cell">{{ listingTitles[b.listingId] || b.listingId?.substring(0,8) + '...' }}</td>
                  <td class="text-muted">{{ landlordNames[b.landlordId] || 'Loading...' }}</td>
                  <td class="date-cell">{{ b.startDate | date:'mediumDate' }} - {{ b.endDate | date:'mediumDate' }}</td>
                  <td class="price-cell">{{ b.currency || '$' }}{{ b.totalAmount?.toLocaleString() }}</td>
                  <td><app-badge [variant]="statusVariant(b.status)">{{ b.status }}</app-badge></td>
                  <td class="actions-cell">
                    <a [routerLink]="['/dashboard/bookings', b.id]" class="btn-outline btn-sm">View</a>
                    @if (b.status === 'PENDING' || b.status === 'ACCEPTED') {
                      <button class="btn-danger btn-sm" (click)="cancel(b)">Cancel</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (totalPages > 1) {
          <div class="pagination">
            <button class="btn-outline btn-sm" [disabled]="page === 0" (click)="goToPage(page - 1)">Previous</button>
            <span class="page-info">Page {{ page + 1 }} of {{ totalPages }}</span>
            <button class="btn-outline btn-sm" [disabled]="page >= totalPages - 1" (click)="goToPage(page + 1)">Next</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .page-header { margin-bottom: $space-6; }
    .page-title { font-size: $text-2xl; font-weight: 800; }
    .page-subtitle { font-size: $text-sm; color: $text-muted; margin-top: $space-1; }
    .table-wrapper { background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; overflow-x: auto; }
    .booking-table { width: 100%; border-collapse: collapse; }
    .booking-table th, .booking-table td { padding: $space-3 $space-4; text-align: left; font-size: $text-sm; border-bottom: 1px solid $card-border; white-space: nowrap; }
    .booking-table th { font-weight: 600; color: $text-muted; text-transform: uppercase; font-size: $text-xs; background: $bg-light; }
    .booking-table tr:last-child td { border-bottom: none; }
    .booking-table tr:hover td { background: $bg-light; }
    .actions-cell { display: flex; gap: $space-2; }
    .text-muted { color: $text-muted; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: $space-3; margin-top: $space-6; }
    .page-info { font-size: $text-sm; color: $text-muted; }
  `]
})
export class RenterBookingsComponent implements OnInit {
  bookings: any[] = []; loading = true; page = 0; totalPages = 0;
  listingTitles: Record<string, string> = {};
  landlordNames: Record<string, string> = {};

  constructor(
    private bookingService: BookingService,
    private lookup: LookupService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.loadBookings(); }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getMyBookings(this.page).subscribe({
      next: (res: any) => {
        const d = res.data || res;
        this.bookings = d.content || d.items || d;
        this.totalPages = d.totalPages || 0;
        this.loading = false;
        this.resolveNames();
      },
      error: () => this.loading = false
    });
  }

  private resolveNames(): void {
    for (const b of this.bookings) {
      if (b.listingId && !this.listingTitles[b.listingId]) {
        this.lookup.getListingTitle(b.listingId).subscribe(t => {
          this.listingTitles = { ...this.listingTitles, [b.listingId]: t };
        });
      }
      if (b.landlordId && !this.landlordNames[b.landlordId]) {
        this.lookup.getUserName(b.landlordId).subscribe(n => {
          this.landlordNames = { ...this.landlordNames, [b.landlordId]: n };
        });
      }
    }
  }

  cancel(b: any): void {
    if (!confirm('Cancel this booking?')) return;
    this.bookingService.cancelBooking(b.id).subscribe({
      next: () => { this.toast.show('Booking cancelled', 'warning'); this.loadBookings(); },
      error: (err) => this.toast.show(err.message || 'Failed', 'error')
    });
  }

  goToPage(p: number): void { this.page = p; this.loadBookings(); }

  statusVariant(s: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
    switch (s) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'danger';
      case 'CANCELLED': return 'neutral';
      default: return 'neutral';
    }
  }
}
