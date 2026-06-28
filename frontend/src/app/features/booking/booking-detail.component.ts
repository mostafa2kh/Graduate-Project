import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { BookingReviewService } from '../../core/services/booking-review.service';
import { ChatService } from '../../core/services/chat.service';
import { LookupService } from '../../core/services/lookup.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ReviewFormComponent } from './review-form.component';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, BadgeComponent, SkeletonComponent, ReviewFormComponent],
  template: `
    <div class="container" style="padding: 2rem 0;">
      <a routerLink="/dashboard/bookings" class="back-link">&larr; Back</a>

      @if (loading) { <app-skeleton type="card" /> }
      @else if (booking) {
        <div class="detail-header">
          <h1 class="detail-title">Booking Details</h1>
          <app-badge [variant]="statusVariant(booking.status)">{{ booking.status }}</app-badge>
        </div>

        <div class="detail-grid">
          <div class="card">
            <div class="card-header"><h3>Booking Info</h3></div>
            <div class="card-body">
                <div class="info-grid">
                  <div class="info-item"><span>Listing</span><strong>{{ listingTitle || booking.listingId }}</strong></div>
                  <div class="info-item"><span>Landlord</span><strong>{{ landlordName || booking.landlordId }}</strong></div>
                  <div class="info-item"><span>Dates</span><strong>{{ booking.startDate | date:'mediumDate' }} - {{ booking.endDate | date:'mediumDate' }}</strong></div>
                <div class="info-item"><span>Total</span><strong>{{ booking.currency || '$' }}{{ booking.totalAmount?.toLocaleString() }}</strong></div>
                  <div class="info-item"><span>Guests</span><strong>{{ booking.guestsCount || 1 }}</strong></div>
                  <div class="info-item">
                    <span>&nbsp;</span>
                    <button class="btn-message" (click)="sendMessage()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      Send Message
                    </button>
                  </div>
                @if (booking.specialRequests) {
                  <div class="info-item full-width"><span>Special Requests</span><strong>{{ booking.specialRequests }}</strong></div>
                }
              </div>
            </div>
          </div>

          @if (booking.statusHistory?.length > 0) {
            <div class="card">
              <div class="card-header"><h3>Status History</h3></div>
              <div class="card-body">
                <div class="timeline">
                  @for (h of booking.statusHistory; track h.id) {
                    <div class="timeline-item">
                      <div class="timeline-dot" [class.active]="h.toStatus === booking.status"></div>
                      <div class="timeline-content">
                        <strong>{{ h.fromStatus || 'N/A' }} &rarr; {{ h.toStatus }}</strong>
                        @if (h.note) { <p class="text-muted">{{ h.note }}</p> }
                        <span class="timeline-date">{{ h.createdAt | date:'medium' }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Review Section -->
          @if (booking.status === 'COMPLETED') {
            <div class="card">
              <div class="card-header"><h3>Review</h3></div>
              <div class="card-body">
                @if (existingReview) {
                  <div class="existing-review">
                    <div class="review-stars">
                      @for (s of [1,2,3,4,5]; track s) {
                        <svg viewBox="0 0 24 24" [attr.fill]="s <= existingReview.rating ? '#F59E0B' : 'none'" stroke="#F59E0B" stroke-width="2" width="20" height="20">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
                        </svg>
                      }
                    </div>
                    @if (existingReview.comment) {
                      <p class="review-comment">{{ existingReview.comment }}</p>
                    }
                    <span class="review-date">Reviewed on {{ existingReview.createdAt | date:'mediumDate' }}</span>
                  </div>
                } @else {
                  <app-review-form [bookingId]="booking.id" (reviewed)="onReviewed()" />
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .back-link { display: inline-block; font-size: $text-sm; color: $primary; text-decoration: none; margin-bottom: $space-6; font-weight: 500; &:hover { text-decoration: underline; } }
    .detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: $space-8; }
    .detail-title { font-size: $text-2xl; font-weight: 800; }
    .detail-grid { display: grid; gap: $space-6; }
    .card { background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; overflow: hidden; }
    .card-header { padding: $space-4 $space-6; border-bottom: 1px solid $card-border; h3 { font-size: $text-lg; font-weight: 700; } }
    .card-body { padding: $space-6; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: $space-4; }
    .info-item { display: flex; flex-direction: column; gap: $space-1; &.full-width { grid-column: 1 / -1; } span { font-size: $text-xs; color: $text-muted; text-transform: uppercase; } strong { font-size: $text-base; } }
    .text-muted { color: $text-muted; font-size: $text-sm; }
    .timeline { position: relative; padding-left: $space-6; }
    .timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: $card-border; }
    .timeline-item { position: relative; padding-bottom: $space-6; }
    .timeline-dot { position: absolute; left: -$space-5; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: $card-border; &.active { background: $primary; } }
    .timeline-content { margin-left: $space-2; }
    .timeline-date { font-size: $text-xs; color: $text-muted; }

    .existing-review {
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }

    .review-stars {
      display: flex;
      gap: 2px;
    }

    .review-comment {
      font-size: $text-sm;
      color: $text-dark;
      line-height: 1.6;
      margin: 0;
    }

    .review-date {
      font-size: $text-xs;
      color: $text-muted;
    }
  `]
})
export class BookingDetailComponent implements OnInit {
  booking: any = null;
  existingReview: any = null;
  loading = true;
  listingTitle = '';
  landlordName = '';
  myId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private reviewService: BookingReviewService,
    private chatService: ChatService,
    private lookup: LookupService,
    private tokenStorage: TokenStorageService
  ) {
    const user = this.tokenStorage.getUser<{ userId: string }>();
    this.myId = user?.userId || '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.bookingService.getBookingDetail(id).subscribe({
      next: (res: any) => {
        this.booking = res.data || res;
        if (this.booking.listingId) {
          this.lookup.getListingTitle(this.booking.listingId).subscribe(t => this.listingTitle = t);
        }
        if (this.booking.landlordId) {
          this.lookup.getUserName(this.booking.landlordId).subscribe(n => this.landlordName = n);
        }
        if (this.booking.status === 'COMPLETED') {
          this.loadReview();
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  private loadReview(): void {
    this.reviewService.getBookingReview(this.booking.id).subscribe({
      next: (res: any) => { this.existingReview = res.data || res; },
      error: () => { this.existingReview = null; }
    });
  }

  onReviewed(): void {
    this.loadReview();
  }

  sendMessage(): void {
    if (!this.booking) return;
    const otherId = this.booking.landlordId === this.myId ? this.booking.renterId : this.booking.landlordId;
    if (!otherId) return;
    this.chatService.createThread(otherId, this.booking.listingId).subscribe({
      next: (res: any) => {
        const thread = res.data || res;
        this.router.navigate(['/dashboard/messages', thread.id || thread.threadId]);
      }
    });
  }

  statusVariant(s: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
    switch (s) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'danger';
      case 'CANCELLED': return 'neutral';
      case 'COMPLETED': return 'primary';
      default: return 'neutral';
    }
  }
}
