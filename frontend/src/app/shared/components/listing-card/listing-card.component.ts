import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ListingCardData {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  imageUrl: string;
  trustScore?: number;
  isVerified?: boolean;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="listing-card" [class.favorited]="listing?.isFavorite">
      <div class="listing-image">
        <div class="image-placeholder">
          @if (listing?.imageUrl) {
            <img [src]="listing?.imageUrl" [alt]="listing?.title" />
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          }
        </div>
        @if (listing?.trustScore) {
          <div class="trust-badge" [style.--score]="listing!.trustScore! / 100">
            {{ listing!.trustScore }}
          </div>
        }
        <button class="fav-btn" (click)="toggleFavorite.emit()" [class.active]="listing?.isFavorite">
          <svg viewBox="0 0 24 24" [attr.fill]="listing?.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      <div class="listing-body">
        <div class="listing-top">
          <span class="listing-type">{{ listing?.propertyType }}</span>
          @if (listing?.isVerified) {
            <span class="verified-badge">Verified</span>
          }
        </div>
        <h3 class="listing-title">{{ listing?.title }}</h3>
        <p class="listing-location">{{ listing?.city }}{{ listing?.area ? ', ' + listing?.area : '' }}</p>
        <div class="listing-features">
          <span class="feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            {{ listing?.bedrooms }} bed
          </span>
          <span class="feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {{ listing?.bathrooms }} bath
          </span>
        </div>
        <div class="listing-footer">
          <span class="listing-price">{{ listing?.currency || '$' }}{{ listing?.price?.toLocaleString() }}<span class="price-period">/mo</span></span>
          <a [routerLink]="[detailLink]" class="btn-outline btn-sm">View</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .listing-card {
      background: $card-light;
      border-radius: $radius-xl;
      box-shadow: $shadow-sm;
      border: 1px solid $card-border;
      overflow: hidden;
      transition: transform $transition-base, box-shadow $transition-base;

      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-lg;
      }
    }

    .listing-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, $primary-bg, $secondary-bg);
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 48px;
        height: 48px;
        color: $text-light;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .trust-badge {
      position: absolute;
      top: $space-3;
      left: $space-3;
      background: rgba($text-white, 0.95);
      backdrop-filter: blur(4px);
      padding: $space-1 $space-2;
      border-radius: $radius-md;
      font-size: $text-xs;
      font-weight: 700;
      color: hsl(calc(var(--score, 0) * 120), 70%, 40%);
    }

    .fav-btn {
      position: absolute;
      top: $space-3;
      right: $space-3;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba($text-white, 0.9);
      backdrop-filter: blur(4px);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all $transition-base;

      svg {
        width: 18px;
        height: 18px;
        color: $text-muted;
      }

      &.active svg {
        color: $danger;
      }

      &:hover {
        transform: scale(1.1);
      }
    }

    .listing-body {
      padding: $space-4 $space-5 $space-5;
    }

    .listing-top {
      display: flex;
      align-items: center;
      gap: $space-2;
      margin-bottom: $space-2;
    }

    .listing-type {
      font-size: $text-xs;
      color: $text-muted;
      text-transform: capitalize;
      background: $bg-gray;
      padding: $space-1 $space-2;
      border-radius: $radius-sm;
    }

    .verified-badge {
      font-size: $text-xs;
      font-weight: 600;
      color: $success;
      background: $success-bg;
      padding: $space-1 $space-2;
      border-radius: $radius-sm;
    }

    .listing-title {
      font-size: $text-base;
      font-weight: 700;
      margin-bottom: $space-1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .listing-location {
      font-size: $text-sm;
      color: $text-muted;
      margin-bottom: $space-3;
    }

    .listing-features {
      display: flex;
      gap: $space-4;
      margin-bottom: $space-4;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: $space-1;
      font-size: $text-xs;
      color: $text-muted;

      svg {
        width: 14px;
        height: 14px;
      }
    }

    .listing-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .listing-price {
      font-size: $text-lg;
      font-weight: 800;
      color: $text-dark;
    }

    .price-period {
      font-size: $text-xs;
      font-weight: 500;
      color: $text-muted;
    }
  `]
})
export class ListingCardComponent {
  @Input() listing?: ListingCardData;
  @Input() link = '';
  @Output() toggleFavorite = new EventEmitter<void>();

  get detailLink(): string { return this.link || '/listings/' + this.listing?.id; }
}
