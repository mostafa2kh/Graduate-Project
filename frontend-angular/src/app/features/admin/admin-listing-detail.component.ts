import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { TrustScoreComponent } from '../../shared/components/trust-score/trust-score.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-listing-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, TrustScoreComponent, BadgeComponent, SkeletonComponent],
  template: `
    <div class="detail-page">
      <a routerLink="/admin/listings" class="back-link">&larr; Back to Pending Listings</a>

      @if (loading) {
        <app-skeleton type="card" />
      } @else if (detail) {
        <div class="detail-header">
          <h1 class="detail-title">{{ detail.listing?.title || 'Listing Review' }}</h1>
          <div class="detail-actions">
            <button class="btn-success" (click)="openApproveModal()">Approve</button>
            <button class="btn-danger" (click)="openRejectModal()">Reject</button>
          </div>
        </div>

        <div class="detail-grid">
          <div class="card">
            <div class="card-header"><h3>AI Review</h3></div>
            <div class="card-body">
              <app-trust-score [score]="aiReview?.trustScore || 0"
                               [subtitle]="aiReview?.summary || ''"
                               [flags]="aiReview?.flags || []" />
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3>Listing Details</h3></div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item"><span>Title</span><strong>{{ detail.listing?.title }}</strong></div>
                <div class="info-item"><span>Type</span><strong>{{ detail.listing?.propertyType }}</strong></div>
                <div class="info-item"><span>Price</span><strong>{{ detail.listing?.currency || 'USD' }} {{ detail.listing?.price?.toLocaleString() }}</strong></div>
                <div class="info-item"><span>Bedrooms</span><strong>{{ detail.listing?.bedrooms }}</strong></div>
                <div class="info-item"><span>Bathrooms</span><strong>{{ detail.listing?.bathrooms }}</strong></div>
                <div class="info-item"><span>Status</span><app-badge [variant]="detail.listing?.status === 'APPROVED' ? 'success' : 'warning'">{{ detail.listing?.status }}</app-badge></div>
              </div>
            </div>
          </div>
        </div>

        @if (showApproveModal || showRejectModal) {
          <div class="modal-overlay" (click)="closeModals()">
            <div class="modal-card" (click)="$event.stopPropagation()">
              <h3 class="modal-title">{{ showApproveModal ? 'Approve Listing' : 'Reject Listing' }}</h3>
              @if (showRejectModal) {
                <div class="form-group">
                  <label>Reason *</label>
                  <textarea class="input-field" rows="3" [(ngModel)]="rejectReason" placeholder="Explain why this listing is rejected"></textarea>
                </div>
              }
              @if (showApproveModal) {
                <div class="form-group">
                  <label>Note (optional)</label>
                  <textarea class="input-field" rows="3" [(ngModel)]="approveNote" placeholder="Admin note"></textarea>
                </div>
              }
              <div class="modal-actions">
                <button class="btn-outline" (click)="closeModals()">Cancel</button>
                <button class="btn-primary" (click)="showApproveModal ? confirmApprove() : confirmReject()"
                        [disabled]="showRejectModal && !rejectReason.trim()">
                  {{ showApproveModal ? 'Approve' : 'Reject' }}
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .detail-page { padding: 0; }

    .back-link {
      display: inline-block;
      font-size: $text-sm;
      color: $primary;
      text-decoration: none;
      margin-bottom: $space-6;
      font-weight: 500;
      &:hover { text-decoration: underline; }
    }

    .detail-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: $space-8;

      @include sm { flex-direction: column; gap: $space-4; }
    }

    .detail-title { font-size: $text-2xl; font-weight: 800; }

    .detail-actions { display: flex; gap: $space-3; }

    .detail-grid { display: grid; gap: $space-6; }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-4;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: $space-1;

      span { font-size: $text-xs; color: $text-muted; text-transform: uppercase; letter-spacing: 0.05em; }
      strong { font-size: $text-base; }
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      background: $card-light;
      border-radius: $radius-lg;
      padding: $space-8;
      min-width: 400px;
      max-width: 500px;
      box-shadow: $shadow-xl;
    }

    .modal-title {
      font-size: $text-xl;
      font-weight: 700;
      margin-bottom: $space-6;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: $space-3;
      margin-top: $space-6;
    }
  `]
})
export class AdminListingDetailComponent implements OnInit {
  listingId = '';
  detail: any = null;
  aiReview: any = null;
  loading = true;
  showApproveModal = false;
  showRejectModal = false;
  rejectReason = '';
  approveNote = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get('listingId') || '';
    this.loadDetail();
  }

  private loadDetail(): void {
    this.adminService.getModerationDetail(this.listingId).subscribe({
      next: (res: any) => {
        this.detail = res.data || res;
        this.aiReview = this.detail.aiReview;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openApproveModal(): void { this.showApproveModal = true; }
  openRejectModal(): void { this.showRejectModal = true; }

  closeModals(): void {
    this.showApproveModal = false;
    this.showRejectModal = false;
    this.rejectReason = '';
    this.approveNote = '';
  }

  confirmApprove(): void {
    this.adminService.approveListing(this.listingId, this.approveNote).subscribe({
      next: () => {
        this.toast.show('Listing approved', 'success');
        this.closeModals();
        this.router.navigate(['/admin/listings']);
      },
      error: (err) => this.toast.show(err.message || 'Failed to approve', 'error')
    });
  }

  confirmReject(): void {
    if (!this.rejectReason.trim()) return;
    this.adminService.rejectListing(this.listingId, this.rejectReason).subscribe({
      next: () => {
        this.toast.show('Listing rejected', 'warning');
        this.closeModals();
        this.router.navigate(['/admin/listings']);
      },
      error: (err) => this.toast.show(err.message || 'Failed to reject', 'error')
    });
  }
}
