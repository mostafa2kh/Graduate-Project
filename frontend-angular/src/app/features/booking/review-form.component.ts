import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingReviewService } from '../../core/services/booking-review.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="review-form">
      <h3 class="review-title">Leave a Review</h3>
      <p class="review-subtitle">Rate your experience for this booking</p>

      <div class="star-rating">
        @for (star of [1,2,3,4,5]; track star) {
          <button type="button" class="star-btn" [class.active]="star <= rating" (click)="rating = star">
            <svg viewBox="0 0 24 24" [attr.fill]="star <= rating ? '#F59E0B' : 'none'" stroke="#F59E0B" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
            </svg>
          </button>
        }
      </div>

      <div class="form-group">
        <textarea class="input-field" rows="3" [(ngModel)]="comment" placeholder="Share your experience (optional)" maxlength="2048"></textarea>
      </div>

      <div class="review-actions">
        <button class="btn-primary" (click)="submit()" [disabled]="submitting || rating === 0">
          {{ submitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .review-form {
      background: $card-light;
      border: 1px solid $card-border;
      border-radius: $radius-lg;
      padding: $space-6;
    }

    .review-title {
      font-size: $text-base;
      font-weight: 700;
      margin-bottom: $space-1;
    }

    .review-subtitle {
      font-size: $text-sm;
      color: $text-muted;
      margin-bottom: $space-4;
    }

    .star-rating {
      display: flex;
      gap: $space-1;
      margin-bottom: $space-4;
    }

    .star-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      transition: transform $transition-base;

      &:hover { transform: scale(1.2); }

      svg {
        width: 28px;
        height: 28px;
      }
    }

    .form-group {
      margin-bottom: $space-4;
    }

    .review-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn-primary {
      background: $primary;
      color: white;
      border: none;
      padding: $space-2 $space-6;
      border-radius: $radius-md;
      font-weight: 600;
      font-size: $text-sm;
      cursor: pointer;
      transition: background $transition-base;

      &:hover { background: darken($primary, 10%); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class ReviewFormComponent {
  @Input() bookingId = '';
  @Output() reviewed = new EventEmitter<void>();

  rating = 0;
  comment = '';
  submitting = false;

  constructor(
    private reviewService: BookingReviewService,
    private toast: ToastService
  ) {}

  submit(): void {
    if (this.rating === 0) {
      this.toast.show('Please select a rating', 'warning');
      return;
    }
    this.submitting = true;
    this.reviewService.createReview(this.bookingId, { rating: this.rating, comment: this.comment }).subscribe({
      next: () => {
        this.toast.show('Review submitted successfully', 'success');
        this.reviewed.emit();
        this.submitting = false;
      },
      error: (err) => {
        this.toast.show(err.message || 'Failed to submit review', 'error');
        this.submitting = false;
      }
    });
  }
}
