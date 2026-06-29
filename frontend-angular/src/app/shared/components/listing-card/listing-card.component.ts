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
    <article class="home-card">
      <a class="home-card-link" [routerLink]="detailLink" [attr.aria-label]="'View ' + (listing?.title || 'listing')">
        <div class="card-media">
          @if (imageSrc) {
            <img [src]="imageSrc" [alt]="listing?.title || 'Apartment photo'" />
          } @else {
            <div class="card-media-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          }

          <div class="card-badges">
            <span class="chip-checked">CHECKED</span>
          </div>

          <button class="btn-favorite" type="button" (click)="toggleFavorite.emit(); $event.preventDefault()" [class.active]="listing?.isFavorite" aria-label="Save listing">
            <svg viewBox="0 0 26 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14.838,21.793 C16.1664969,20.8082414 17.4510698,19.7655686 18.688,18.668 C22.114,15.614 24.385,12.72 24.916,10.273 C25.1372749,9.55273562 25.25,8.80348745 25.25,8.05 C25.25,5.395 23.882,2.943 21.696,1.657 L21.689,1.653 C20.6837081,1.06403384 19.5401124,0.752426441 18.375,0.75 C16.557,0.75 14.832,1.504 13.547,2.859 L13.004,3.431 L12.46,2.861 C11.168,1.504 9.438,0.75 7.62,0.75 C6.45702723,0.754247176 5.31583177,1.06576456 4.312,1.653 C2.118,2.938 0.75,5.39 0.75,8.05 C0.75,8.804 0.862,9.552 1.1,10.335 C1.613,12.72 3.886,15.613 7.315,18.668 C8.55324262,19.7656512 9.8391512,20.8083249 11.169,21.793 C11.7703874,22.2425988 12.3782218,22.5790515 13,23 C13.423,22.716 14.063,22.37 14.838,21.793 Z"/>
            </svg>
          </button>
        </div>

        <div class="card-body">
          <div class="card-price">
            <strong>{{ listing?.currency || '$' }}{{ listing?.price?.toLocaleString() }}</strong>
            <span>/month</span>
          </div>

          <h3 class="card-title">{{ listing?.title }}</h3>
          <p class="card-location">{{ listing?.city }}{{ listing?.area ? ', ' + listing?.area : '' }}</p>

          <div class="card-features">
            <span>{{ listing?.bedrooms || 0 }} {{ (listing?.bedrooms || 0) === 1 ? 'bed' : 'beds' }}</span>
            <span>{{ listing?.bathrooms || 0 }} {{ (listing?.bathrooms || 0) === 1 ? 'bath' : 'baths' }}</span>
            @if (listing?.areaSize) {
              <span>{{ listing?.areaSize?.toLocaleString() }} {{ listing?.areaUnit || 'sqft' }}</span>
            }
          </div>
        </div>
      </a>
    </article>
  `,
  styles: [`
    @use 'index' as *;

    .home-card {
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      border: 1px solid rgba(#0D0D0D, 0.08);
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .home-card:hover {
      box-shadow: 0 8px 30px rgba(204, 214, 221, 0.32);
      transform: translateY(-2px);
    }

    .home-card-link {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    .card-media {
      position: relative;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      background: #EBEBEB;
    }

    .card-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .home-card:hover .card-media img { transform: scale(1.04); }

    .card-media-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c7c7c7;
    }

    .card-media-placeholder svg { width: 44px; height: 44px; }

    .card-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .chip-checked {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;
      background: #0D0D0D;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      line-height: 1;
    }

    .btn-favorite {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 2;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.92);
      color: #0D0D0D;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .btn-favorite:hover { transform: scale(1.1); }
    .btn-favorite.active { color: #e34242; }

    .card-body {
      padding: 14px 16px 16px;
    }

    .card-price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 6px;
    }

    .card-price strong {
      color: #0D0D0D;
      font-size: 1.125rem;
      font-weight: 700;
    }

    .card-price span {
      color: #676767;
      font-size: 0.875rem;
    }

    .card-title {
      color: #0D0D0D;
      font-size: 0.9375rem;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-location {
      color: #676767;
      font-size: 0.8125rem;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-features {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
      color: #676767;
      font-size: 0.8125rem;
    }

    .card-features span:not(:last-child)::after {
      content: '';
      display: inline-block;
      width: 3px;
      height: 3px;
      margin-left: 10px;
      border-radius: 50%;
      background: #c7c7c7;
      vertical-align: middle;
    }
  `]
})
export class ListingCardComponent {
  @Input() listing?: ListingCardData;
  @Input() link = '';
  @Output() toggleFavorite = new EventEmitter<void>();

  get imageSrc(): string | undefined { return this.listing?.primaryImageUrl || this.listing?.imageUrl; }

  get detailLink(): string { return this.link || '/search/' + this.listing?.id; }
}
