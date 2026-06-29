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
  imageUrl?: string;
  primaryImageUrl?: string;
  areaSize?: number;
  areaUnit?: string;
  furnished?: boolean;
  trustScore?: number;
  isVerified?: boolean;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="listing-card">
      <a class="photo" [routerLink]="detailLink" [attr.aria-label]="'View ' + (listing?.title || 'listing')">
        @if (imageSrc) {
          <img [src]="imageSrc" [alt]="listing?.title || 'Apartment photo'" />
        } @else {
          <div class="photo-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        }

        @if (listing?.trustScore) {
          <span class="trust-badge">Trust {{ listing!.trustScore }}</span>
        }
      </a>

      <button class="save-button" type="button" (click)="toggleFavorite.emit()" [class.active]="listing?.isFavorite" aria-label="Save listing">
        <svg viewBox="0 0 24 24" [attr.fill]="listing?.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>

      <div class="card-body">
        <div class="card-topline">
          <span>{{ listing?.propertyType || 'Apartment' }}</span>
          @if (listing?.furnished) { <span>Furnished</span> }
        </div>

        <a [routerLink]="detailLink" class="title">{{ listing?.title }}</a>
        <p class="location">{{ listing?.city }}{{ listing?.area ? ', ' + listing?.area : '' }}</p>

        <div class="features">
          <span>{{ listing?.bedrooms || 0 }} bed</span>
          <span>{{ listing?.bathrooms || 0 }} bath</span>
          @if (listing?.areaSize) { <span>{{ listing?.areaSize?.toLocaleString() }} {{ listing?.areaUnit || 'sqft' }}</span> }
        </div>

        <div class="price-row">
          <strong>{{ listing?.currency || '$' }} {{ listing?.price?.toLocaleString() }}</strong>
          <span>/ month</span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    @use 'index' as *;

    .listing-card {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(#13211f, 0.1);
      border-radius: 16px;
      background: #fff;
      transition: border-color $transition-base, box-shadow $transition-base, transform $transition-base;
    }

    .listing-card:hover {
      border-color: rgba(#13211f, 0.22);
      box-shadow: 0 18px 44px rgba(#13211f, 0.1);
      transform: translateY(-3px);
    }

    .photo {
      position: relative;
      display: block;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: #ede7db;
    }

    .photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-slow;
    }

    .listing-card:hover .photo img { transform: scale(1.035); }

    .photo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9aa4a1;
    }

    .photo-placeholder svg { width: 44px; height: 44px; }

    .trust-badge {
      position: absolute;
      left: $space-3;
      top: $space-3;
      padding: $space-2 $space-3;
      border-radius: $radius-full;
      background: rgba(#13211f, 0.84);
      color: #fff;
      font-size: $text-xs;
      font-weight: 900;
      backdrop-filter: blur(8px);
    }

    .save-button {
      position: absolute;
      top: $space-3;
      right: $space-3;
      z-index: 2;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(#13211f, 0.12);
      border-radius: 50%;
      background: rgba(#fff, 0.92);
      color: #13211f;
      backdrop-filter: blur(8px);
    }

    .save-button svg { width: 17px; height: 17px; }
    .save-button.active { color: $danger; }

    .card-body { padding: $space-4; }

    .card-topline {
      display: flex;
      flex-wrap: wrap;
      gap: $space-2;
      margin-bottom: $space-3;
    }

    .card-topline span {
      color: #8a6a35;
      font-size: 0.68rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .title {
      display: block;
      color: #13211f;
      font-size: $text-base;
      font-weight: 900;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .title:hover { color: #8a6a35; }

    .location {
      margin-top: $space-1;
      color: #66736f;
      font-size: $text-sm;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .features {
      display: flex;
      flex-wrap: wrap;
      gap: $space-2;
      margin-top: $space-3;
      color: #47534f;
      font-size: $text-sm;
    }

    .features span:not(:last-child)::after {
      content: '';
      display: inline-block;
      width: 3px;
      height: 3px;
      margin-left: $space-2;
      border-radius: 50%;
      background: #a7b0ad;
      vertical-align: middle;
    }

    .price-row {
      display: flex;
      align-items: baseline;
      gap: $space-1;
      margin-top: $space-4;
      padding-top: $space-4;
      border-top: 1px solid rgba(#13211f, 0.08);
    }

    .price-row strong {
      color: #13211f;
      font-size: $text-xl;
      font-weight: 950;
      letter-spacing: -0.035em;
    }

    .price-row span { color: #66736f; font-size: $text-sm; }
  `]
})
export class ListingCardComponent {
  @Input() listing?: ListingCardData;
  @Input() link = '';
  @Output() toggleFavorite = new EventEmitter<void>();

  get imageSrc(): string | undefined { return this.listing?.primaryImageUrl || this.listing?.imageUrl; }

  get detailLink(): string { return this.link || '/search/' + this.listing?.id; }
}
