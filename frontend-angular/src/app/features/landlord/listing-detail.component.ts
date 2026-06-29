import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ListingService } from '../../core/services/listing.service';
import { MediaService, ImageResponse } from '../../core/services/media.service';
import { ListingDetail } from '../../core/models/listing.models';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';
import { TrustScoreComponent } from '../../shared/components/trust-score/trust-score.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, BadgeComponent, SkeletonComponent, ImageUploadComponent, TrustScoreComponent],
  template: `
    <div class="container" style="padding: 2rem 0;">
      <a routerLink="/dashboard/listings" class="back-link">&larr; Back to My Listings</a>

      @if (loading) {
        <app-skeleton type="card" />
      } @else if (listing) {
        <div class="detail-header">
          <div>
            <h1 class="detail-title">{{ listing.title }}</h1>
            <p class="detail-location">{{ listing.address?.city }}{{ listing.address?.area ? ', ' + listing.address?.area : '' }}</p>
          </div>
          <div class="detail-actions">
            <app-badge [variant]="statusVariant" [icon]="statusIcon">{{ listing.status }}</app-badge>
            @if (listing.status === 'DRAFT') {
              <button class="btn-primary" (click)="submitForReview()">Submit for Review</button>
            }
          </div>
        </div>

        @if (images.length > 0) {
          <div class="image-gallery">
            <div class="gallery-primary">
              <img [src]="primaryImage?.url ? getFileUrl(primaryImage!.mediaFileId) : ''"
                   [alt]="listing.title" class="gallery-main-img" />
            </div>
            @if (images.length > 1) {
              <div class="gallery-thumbnails">
                @for (img of images.slice(0, 5); track img.imageId) {
                  <div class="thumbnail" [class.primary]="img.isPrimary">
                    <img [src]="getFileUrl(img.mediaFileId)" [alt]="img.fileName"
                         (click)="setPrimary(img)" class="thumb-img" />
                    @if (img.isPrimary) {
                      <span class="primary-badge">Primary</span>
                    }
                    <button class="delete-btn" (click)="deleteImage(img)" title="Delete">&times;</button>
                  </div>
                }
              </div>
            }
          </div>
        }

        <div class="image-upload-section">
          <app-image-upload [listingId]="listingId" [minCount]="3" [maxCount]="20"
                            [currentCount]="images.length"
                            (uploadComplete)="onUploadComplete($event)" />
        </div>

        @if (reviewResult) {
          <div class="review-section">
            <app-trust-score [score]="reviewResult.trustScore"
                             [subtitle]="reviewResult.summary"
                             [flags]="reviewResult.flags || []" />
          </div>
        }

        <div class="detail-grid">
          <div class="card info-card">
            <div class="card-header"><h3>Property Details</h3></div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item"><span>Price</span><strong>{{ listing.currency }} {{ listing.price.toLocaleString() }}/mo</strong></div>
                <div class="info-item"><span>Type</span><strong>{{ listing.propertyType }}</strong></div>
                <div class="info-item"><span>Bedrooms</span><strong>{{ listing.bedrooms }}</strong></div>
                <div class="info-item"><span>Bathrooms</span><strong>{{ listing.bathrooms }}</strong></div>
                <div class="info-item"><span>Area</span><strong>{{ listing.areaSize }} {{ listing.areaUnit }}</strong></div>
                <div class="info-item"><span>Furnished</span><strong>{{ listing.furnished ? 'Yes' : 'No' }}</strong></div>
                <div class="info-item"><span>Year Built</span><strong>{{ listing.yearBuilt || 'N/A' }}</strong></div>
                <div class="info-item"><span>Views</span><strong>{{ listing.viewsCount }}</strong></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3>Description</h3></div>
            <div class="card-body">
              <p class="description-text">{{ listing.description }}</p>
            </div>
          </div>

          @if (listing.amenities && listing.amenities.length > 0) {
            <div class="card">
              <div class="card-header"><h3>Amenities ({{ listing.amenities.length }})</h3></div>
              <div class="card-body">
                <div class="amenities-list">
                  @for (a of listing.amenities; track a.id) {
                    <span class="amenity-tag">{{ a.name }}</span>
                  }
                </div>
              </div>
            </div>
          }

          @if (listing.statusHistory && listing.statusHistory.length > 0) {
            <div class="card">
              <div class="card-header"><h3>Status History</h3></div>
              <div class="card-body">
                @for (h of listing.statusHistory; track h.id) {
                  <div class="history-item">
                    <div class="history-status">
                      @if (h.fromStatus) {
                        <span class="status-tag">{{ h.fromStatus }}</span>
                        <span class="arrow">&rarr;</span>
                      }
                      <span class="status-tag current">{{ h.toStatus }}</span>
                    </div>
                    <span class="history-date">{{ h.createdAt | date:'medium' }}</span>
                  </div>
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

    .detail-title {
      font-size: $text-2xl;
      font-weight: 800;
    }

    .detail-location {
      font-size: $text-sm;
      color: $text-muted;
      margin-top: $space-1;
    }

    .detail-actions {
      display: flex;
      align-items: center;
      gap: $space-3;
    }

    .image-gallery {
      margin-bottom: $space-6;

      .gallery-primary {
        border-radius: $radius-lg;
        overflow: hidden;
        margin-bottom: $space-3;
        aspect-ratio: 16 / 9;
        background: $bg-gray;

        .gallery-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .gallery-thumbnails {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: $space-2;
      }

      .thumbnail {
        position: relative;
        aspect-ratio: 4 / 3;
        border-radius: $radius-md;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;

        &.primary { border-color: $primary; }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .primary-badge {
          position: absolute;
          top: $space-1;
          left: $space-1;
          background: $primary;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: $radius-sm;
        }

        .delete-btn {
          position: absolute;
          top: $space-1;
          right: $space-1;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.6);
          color: white;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity $transition-base;

          &:hover { background: $danger; }
        }

        &:hover .delete-btn { opacity: 1; }
      }
    }

    .review-section {
      margin-bottom: $space-6;
    }

    .image-upload-section {
      margin-bottom: $space-6;
    }

    .detail-grid {
      display: grid;
      gap: $space-6;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-4;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: $space-1;

      span {
        font-size: $text-xs;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      strong { font-size: $text-base; }
    }

    .description-text {
      font-size: $text-sm;
      line-height: 1.8;
      color: $text-muted;
    }

    .amenities-list {
      display: flex;
      flex-wrap: wrap;
      gap: $space-2;
    }

    .amenity-tag {
      padding: $space-1 $space-3;
      background: $primary-bg;
      color: $primary;
      border-radius: $radius-full;
      font-size: $text-xs;
      font-weight: 600;
    }

    .history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-3 0;
      border-bottom: 1px solid $card-border;

      &:last-child { border-bottom: none; }
    }

    .history-status {
      display: flex;
      align-items: center;
      gap: $space-2;
    }

    .status-tag {
      padding: $space-1 $space-2;
      background: $bg-gray;
      border-radius: $radius-sm;
      font-size: $text-xs;
      font-weight: 600;

      &.current { background: $primary-bg; color: $primary; }
    }

    .arrow {
      font-size: $text-sm;
      color: $text-light;
    }

    .history-date {
      font-size: $text-xs;
      color: $text-muted;
    }
  `]
})
export class ListingDetailComponent implements OnInit {
  listing: ListingDetail | null = null;
  loading = true;
  listingId = '';
  images: ImageResponse[] = [];
  reviewResult: any = null;

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private mediaService: MediaService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get('id') || '';
    if (this.listingId) this.loadListing();
  }

  get primaryImage(): ImageResponse | undefined {
    return this.images.find(i => i.isPrimary);
  }

  get statusVariant(): 'success' | 'warning' | 'primary' | 'danger' | 'neutral' {
    const s = this.listing?.status;
    if (s === 'APPROVED' || s === 'RENTED') return 'success';
    if (s === 'DRAFT') return 'neutral';
    if (s === 'PENDING_REVIEW') return 'warning';
    if (s === 'REJECTED') return 'danger';
    return 'primary';
  }

  get statusIcon(): 'check' | 'x' | 'clock' | undefined {
    const s = this.listing?.status;
    if (s === 'APPROVED') return 'check';
    if (s === 'REJECTED') return 'x';
    if (s === 'PENDING_REVIEW') return 'clock';
    return undefined as any;
  }

  getFileUrl(fileId: string): string {
    return this.mediaService.getFileUrl(fileId);
  }

  private loadListing(): void {
    this.listingService.getMyListingDetails(this.listingId).subscribe({
      next: (res) => { this.listing = res.data; this.loading = false; this.loadImages(); this.loadReview(); },
      error: () => { this.toast.show('Failed to load listing', 'error'); this.loading = false; }
    });
  }

  private loadImages(): void {
    this.mediaService.getListingImages(this.listingId).subscribe({
      next: (res: any) => { this.images = Array.isArray(res) ? res : (res.data || []); },
      error: () => {}
    });
  }

  private loadReview(): void {
    this.mediaService.getReview(this.listingId).subscribe({
      next: (res: any) => { this.reviewResult = res.data || res; },
      error: () => {}
    });
  }

  onUploadComplete(results: any[]): void {
    this.toast.show(results.length + ' image(s) uploaded', 'success');
    this.loadImages();
  }

  setPrimary(img: ImageResponse): void {
    if (img.isPrimary) return;
    this.mediaService.setPrimaryImage(this.listingId, img.imageId).subscribe({
      next: () => this.loadImages(),
      error: (err) => this.toast.show('Failed to set primary image', 'error')
    });
  }

  deleteImage(img: ImageResponse): void {
    if (!confirm('Delete this image?')) return;
    this.mediaService.deleteImage(img.imageId, this.listingId).subscribe({
      next: () => { this.loadImages(); this.toast.show('Image deleted', 'success'); },
      error: (err) => this.toast.show('Failed to delete image', 'error')
    });
  }

  submitForReview(): void {
    this.listingService.submitForReview(this.listingId).subscribe({
      next: (res) => {
        this.listing = res.data;
        this.toast.show('Listing submitted for review', 'success');
      },
      error: (err) => this.toast.show(err.message || 'Failed to submit', 'error')
    });
  }
}
