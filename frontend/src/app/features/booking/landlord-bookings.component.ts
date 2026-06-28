import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { LookupService } from '../../core/services/lookup.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-landlord-bookings',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, FormsModule, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <div class="page-header"><h1 class="page-title">Booking Requests</h1><p class="page-subtitle">Review and manage booking requests for your listings</p></div>

      @if (loading) { <app-skeleton type="table-row" /> }
      @else if (bookings.length === 0) { <app-empty-state icon="folder" title="No booking requests" message="No one has requested to book your listings yet." /> }
      @else {
        <div class="table-wrapper">
          <table class="booking-table">
            <thead><tr><th>Listing</th><th>Renter</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              @for (b of bookings; track b.id) {
                <tr>
                  <td class="text-muted">{{ listingTitles[b.listingId] || b.listingId?.substring(0,8) + '...' }}</td>
                  <td class="text-muted">{{ renterNames[b.renterId] || b.renterId?.substring(0,8) + '...' }}</td>
                  <td>{{ b.startDate | date:'mediumDate' }} - {{ b.endDate | date:'mediumDate' }}</td>
                  <td>{{ b.currency || '$' }}{{ b.totalAmount?.toLocaleString() }}</td>
                  <td><app-badge [variant]="statusVariant(b.status)">{{ b.status }}</app-badge></td>
                  <td class="actions-cell">
                    @if (b.status === 'PENDING') {
                      <button class="btn-success btn-sm" (click)="accept(b)">Accept</button>
                      <button class="btn-danger btn-sm" (click)="openReject(b)">Reject</button>
                    } @else {
                      <span class="text-muted">No actions</span>
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

    @if (showRejectModal) {
      <div class="modal-overlay" (click)="closeModals()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3 class="modal-title">Reject Booking</h3>
          <div class="form-group"><label>Reason *</label><textarea class="input-field" rows="3" [(ngModel)]="rejectReason" placeholder="Explain why you're rejecting..."></textarea></div>
          <div class="modal-actions"><button class="btn-outline" (click)="closeModals()">Cancel</button><button class="btn-primary" (click)="confirmReject()" [disabled]="!rejectReason.trim()">Reject</button></div>
        </div>
      </div>
    }
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
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { background: $card-light; border-radius: $radius-lg; padding: $space-8; min-width: 400px; max-width: 500px; box-shadow: $shadow-xl; }
    .modal-title { font-size: $text-xl; font-weight: 700; margin-bottom: $space-6; }
    .modal-actions { display: flex; justify-content: flex-end; gap: $space-3; margin-top: $space-6; }
  `]
})
export class LandlordBookingsComponent implements OnInit {
  bookings: any[] = []; loading = true; page = 0; totalPages = 0;
  showRejectModal = false; rejectReason = ''; selectedBooking: any = null;
  listingTitles: Record<string, string> = {};
  renterNames: Record<string, string> = {};

  constructor(
    private bookingService: BookingService,
    private lookup: LookupService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.loadBookings(); }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getLandlordBookings(this.page).subscribe({
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
      if (b.renterId && !this.renterNames[b.renterId]) {
        this.lookup.getUserName(b.renterId).subscribe(n => {
          this.renterNames = { ...this.renterNames, [b.renterId]: n };
        });
      }
    }
  }

  accept(b: any): void {
    this.bookingService.acceptBooking(b.id).subscribe({
      next: () => { this.toast.show('Booking accepted', 'success'); this.loadBookings(); },
      error: (err) => this.toast.show(err.message || 'Failed', 'error')
    });
  }

  openReject(b: any): void { this.selectedBooking = b; this.showRejectModal = true; }
  closeModals(): void { this.showRejectModal = false; this.rejectReason = ''; this.selectedBooking = null; }

  confirmReject(): void {
    if (!this.rejectReason.trim() || !this.selectedBooking) return;
    this.bookingService.rejectBooking(this.selectedBooking.id, this.rejectReason).subscribe({
      next: () => { this.toast.show('Booking rejected', 'warning'); this.closeModals(); this.loadBookings(); },
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
