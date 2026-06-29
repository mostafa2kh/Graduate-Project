import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SearchService } from '../../core/services/search.service';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { TrustScoreComponent } from '../../shared/components/trust-score/trust-score.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-search-listing-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, BadgeComponent, SkeletonComponent, TrustScoreComponent],
  template: `
    @if (loading) {
      <div class="container"><app-skeleton type="card" /><div style="margin-top: 1rem"><app-skeleton type="card" /></div></div>
    } @else if (listing) {
      <div class="detail-page">
        <div class="detail-hero">
          @if (listing.primaryImageUrl) {
            <img [src]="listing.primaryImageUrl" [alt]="listing.title" />
          } @else {
            <div class="hero-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
          }
          <a routerLink="/search" class="back-link">&larr; Back</a>
        </div>

        <div class="container">
          <div class="detail-layout">
            <div class="detail-main">
              <div class="detail-header">
                <div class="price-title">
                  <span class="detail-price">{{ listing.currency || '$' }}{{ listing.price?.toLocaleString() }}</span>
                  <span class="detail-period">/month</span>
                </div>
                <h1>{{ listing.title }}</h1>
                <p class="detail-location">{{ listing.city }}{{ listing.area ? ', ' + listing.area : '' }}{{ listing.state ? ', ' + listing.state : '' }}</p>
                <div class="detail-tags">
                  @if (listing.propertyType) { <span class="tag">{{ listing.propertyType }}</span> }
                  @if (listing.furnished) { <span class="tag tag-orange">Furnished</span> }
                </div>
              </div>

              <div class="detail-stats">
                <div class="stat">
                  <strong>{{ listing.bedrooms || 0 }}</strong>
                  <span>{{ (listing.bedrooms || 0) === 1 ? 'Bedroom' : 'Bedrooms' }}</span>
                </div>
                <div class="stat">
                  <strong>{{ listing.bathrooms || 0 }}</strong>
                  <span>{{ (listing.bathrooms || 0) === 1 ? 'Bathroom' : 'Bathrooms' }}</span>
                </div>
                @if (listing.areaSize) {
                  <div class="stat">
                    <strong>{{ listing.areaSize?.toLocaleString() }}</strong>
                    <span>{{ listing.areaUnit || 'sqft' }}</span>
                  </div>
                }
              </div>

              <div class="section">
                <h2>Description</h2>
                <p>{{ listing.description || 'No description provided.' }}</p>
              </div>

              <div class="section">
                <h2>Amenities</h2>
                <div class="amenities">
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <span>{{ listing.bedrooms || 0 }} bedroom{{ (listing.bedrooms || 0) !== 1 ? 's' : '' }}</span>
                  </div>
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>{{ listing.bathrooms || 0 }} bathroom{{ (listing.bathrooms || 0) !== 1 ? 's' : '' }}</span>
                  </div>
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                    <span>{{ listing.propertyType || 'Apartment' }}</span>
                  </div>
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    <span>{{ listing.furnished ? 'Fully furnished' : 'Unfurnished' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <aside class="detail-sidebar">
              <div class="booking-card">
                <div class="booking-price">
                  <span class="bp-amount">{{ listing.currency || '$' }}{{ listing.price?.toLocaleString() }}</span>
                  <span class="bp-period">/month</span>
                </div>

                <div class="booking-trust">
                  <span>Trust score</span>
                  <app-trust-score [score]="listing.trustScore || 0" />
                </div>

                <ul class="booking-features">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg> Verified listing</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg> Secure booking</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg> Direct landlord contact</li>
                </ul>

                <button class="btn-contact" (click)="contactLandlord()" [disabled]="contacting">
                  {{ contacting ? 'Opening Chat...' : 'Contact Landlord' }}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Listing not found</h2>
        <p style="color: #676767; margin-top: 0.5rem;">This listing may not be available.</p>
        <a routerLink="/search" class="back-link" style="display: inline-block; margin-top: 1.5rem;">&larr; Back to search</a>
      </div>
    }
  `,
  styles: [`
    @use 'index' as *;

    .detail-page { min-height: 100vh; background: #F7F7F7; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    .detail-hero {
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      background: #EBEBEB;
    }

    .detail-hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c7c7c7;
    }

    .hero-placeholder svg { width: 64px; height: 64px; }

    .back-link {
      position: absolute;
      top: 20px;
      left: 20px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.92);
      color: #0D0D0D;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      backdrop-filter: blur(8px);
    }

    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 32px;
      padding-top: 28px;
      padding-bottom: 60px;
      align-items: start;
    }

    .detail-header { margin-bottom: 24px; }

    .price-title { margin-bottom: 8px; }

    .detail-price {
      color: #FB6E44;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .detail-period { color: #676767; font-size: 1rem; margin-left: 4px; }

    .detail-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0D0D0D;
      line-height: 1.2;
      margin-bottom: 6px;
    }

    .detail-location { color: #676767; font-size: 0.9375rem; margin-bottom: 12px; }

    .detail-tags { display: flex; flex-wrap: wrap; gap: 8px; }

    .tag {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: 100px;
      background: #F4EFED;
      color: #676767;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .tag-orange { background: #FFF0EB; color: #FB6E44; }

    .detail-stats {
      display: flex;
      gap: 32px;
      margin-bottom: 28px;
      padding: 20px 24px;
      border: 1px solid rgba(#0D0D0D, 0.08);
      border-radius: 12px;
      background: #fff;
    }

    .stat { text-align: center; }
    .stat strong { display: block; color: #0D0D0D; font-size: 1.5rem; font-weight: 700; }
    .stat span { color: #676767; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }

    .section { margin-bottom: 28px; }

    .section h2 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #0D0D0D;
      margin-bottom: 14px;
    }

    .section p { color: #444; font-size: 0.9375rem; line-height: 1.7; }

    .amenities {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .amenity {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid rgba(#0D0D0D, 0.08);
      border-radius: 10px;
      background: #fff;
    }

    .amenity svg { width: 18px; height: 18px; color: #FB6E44; flex-shrink: 0; }
    .amenity span { color: #0D0D0D; font-size: 0.875rem; }

    .detail-sidebar { position: sticky; top: calc(72px + 24px); }

    .booking-card {
      padding: 24px;
      border: 1px solid rgba(#0D0D0D, 0.1);
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 4px 20px rgba(204, 214, 221, 0.24);
    }

    .booking-price { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(#0D0D0D, 0.08); }
    .bp-amount { color: #FB6E44; font-size: 1.75rem; font-weight: 700; }
    .bp-period { color: #676767; font-size: 1rem; margin-left: 4px; }

    .booking-trust {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }

    .booking-trust span { color: #676767; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }

    .booking-features {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .booking-features li {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #676767;
      font-size: 0.875rem;
    }

    .booking-features svg { color: #0cc48c; flex-shrink: 0; }

    .btn-contact {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: #FB6E44;
      color: #fff;
      font-size: 0.9375rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .btn-contact:hover:not(:disabled) { background: #af4d2f; }
    .btn-contact:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 960px) {
      .detail-layout { grid-template-columns: 1fr; }
      .detail-hero { height: 280px; }
    }

    @media (max-width: 640px) {
      .detail-hero { height: 200px; }
      .amenities { grid-template-columns: 1fr; }
      .detail-stats { gap: 20px; padding: 16px; }
    }
  `]
})
export class SearchListingDetailComponent implements OnInit {
  listing: any = null; loading = true;
  contacting = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.searchService.getListingDetail(id).subscribe({
      next: (res: any) => { this.listing = res.data || res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  contactLandlord(): void {
    if (!this.authService.isAuthenticated()) {
      this.toast.show('Please log in as a renter to contact landlords', 'warning');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    if (!this.authService.hasRole('ROLE_RENTER')) {
      this.toast.show('Only renters can start a landlord conversation from a listing', 'error');
      return;
    }
    if (!this.listing?.landlordId) { this.toast.show('Landlord information unavailable', 'error'); return; }
    this.contacting = true;
    this.chatService.createThread(this.listing.landlordId, this.listing.id).subscribe({
      next: (res: any) => {
        const thread = res.data || res;
        this.router.navigate(['/dashboard/messages', thread.id || thread.threadId]);
      },
      error: (err) => {
        this.toast.show(err.message || 'Failed to start conversation', 'error');
        this.contacting = false;
      }
    });
  }
}
