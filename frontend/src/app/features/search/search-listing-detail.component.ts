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
      <div class="container" style="padding: 2rem 0;">
        <app-skeleton type="card" />
        <div style="margin-top: 1rem"><app-skeleton type="card" /></div>
      </div>
    } @else if (listing) {
      <div class="detail-page">
        <div class="detail-hero">
          @if (listing.primaryImageUrl) {
            <img [src]="listing.primaryImageUrl" [alt]="listing.title" />
          } @else {
            <div class="hero-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          }
          <div class="hero-nav">
            <a routerLink="/search" class="back-btn">&larr; Back to search</a>
          </div>
        </div>

        <div class="container">
          <div class="detail-layout">
            <div class="detail-main">
              <div class="detail-header">
                <div>
                  <div class="header-tags">
                    @if (listing.propertyType) { <span class="tag">{{ listing.propertyType }}</span> }
                    @if (listing.furnished) { <span class="tag tag-gold">Furnished</span> }
                    @if (listing.isVerified) { <span class="tag tag-green">Verified</span> }
                  </div>
                  <h1>{{ listing.title }}</h1>
                  <p class="detail-address">
                    {{ listing.city }}{{ listing.area ? ', ' + listing.area : '' }}{{ listing.state ? ', ' + listing.state : '' }}
                  </p>
                </div>
              </div>

              <div class="detail-stats">
                @if (listing.bedrooms != null) {
                  <div class="stat-unit">
                    <strong>{{ listing.bedrooms }}</strong>
                    <span>{{ listing.bedrooms === 1 ? 'Bed' : 'Beds' }}</span>
                  </div>
                }
                @if (listing.bathrooms != null) {
                  <div class="stat-unit">
                    <strong>{{ listing.bathrooms }}</strong>
                    <span>{{ listing.bathrooms === 1 ? 'Bath' : 'Baths' }}</span>
                  </div>
                }
                @if (listing.areaSize) {
                  <div class="stat-unit">
                    <strong>{{ listing.areaSize?.toLocaleString() }}</strong>
                    <span>{{ listing.areaUnit || 'sqft' }}</span>
                  </div>
                }
              </div>

              <div class="section">
                <h2>About this home</h2>
                <p class="description">{{ listing.description || 'No description provided.' }}</p>
              </div>

              <div class="section">
                <h2>Amenities</h2>
                <div class="amenities-grid">
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <span>{{ listing.bedrooms || 0 }} bedroom{{ listing.bedrooms !== 1 ? 's' : '' }}</span>
                  </div>
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>{{ listing.bathrooms || 0 }} bathroom{{ listing.bathrooms !== 1 ? 's' : '' }}</span>
                  </div>
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                    <span>{{ listing.propertyType || 'Apartment' }}</span>
                  </div>
                  <div class="amenity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    <span>{{ listing.furnished ? 'Fully furnished' : 'Unfurnished' }}</span>
                  </div>
                  @if (listing.areaSize) {
                    <div class="amenity">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                      <span>{{ listing.areaSize?.toLocaleString() }} {{ listing.areaUnit || 'sqft' }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <aside class="detail-sidebar">
              <div class="booking-card">
                <div class="booking-header">
                  <span class="booking-price">{{ listing.currency || '$' }}{{ listing.price?.toLocaleString() }}</span>
                  <span class="booking-period">/month</span>
                </div>

                <div class="booking-trust">
                  <span class="trust-label">Trust score</span>
                  <app-trust-score [score]="listing.trustScore || 0" />
                </div>

                <ul class="booking-features">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified listing
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                    Secure booking
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                    Direct landlord contact
                  </li>
                </ul>

                <button class="contact-btn" (click)="contactLandlord()" [disabled]="contacting">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  {{ contacting ? 'Opening Chat...' : 'Contact Landlord' }}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2 style="font-size: 1.5rem;">Listing not found</h2>
        <p style="color: #63716e; margin-top: 0.5rem;">This listing may not be available.</p>
        <a routerLink="/search" class="back-btn" style="display: inline-block; margin-top: 1.5rem;">&larr; Back to search</a>
      </div>
    }
  `,
  styles: [`
    @use 'index' as *;

    .detail-page { min-height: 100vh; background: #fbfaf6; }
    .container { max-width: 1240px; margin: 0 auto; padding: 0 $space-6; }

    .detail-hero {
      position: relative;
      width: 100%;
      height: 480px;
      overflow: hidden;
      background: #ede7db;
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
      color: #9aa4a1;
    }

    .hero-placeholder svg { width: 64px; height: 64px; }

    .hero-nav {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: $space-6;
      background: linear-gradient(180deg, rgba(#000, 0.36), transparent);
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      padding: $space-2 $space-4;
      border-radius: $radius-full;
      background: rgba(#fff, 0.92);
      color: #13211f;
      font-size: $text-sm;
      font-weight: 800;
      text-decoration: none;
      backdrop-filter: blur(8px);
      transition: background $transition-base;
    }

    .back-btn:hover { background: #fff; }

    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: $space-10;
      padding-top: $space-8;
      padding-bottom: $space-16;
      align-items: start;
    }

    .detail-header { margin-bottom: $space-6; }

    .header-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $space-2;
      margin-bottom: $space-3;
    }

    .tag {
      display: inline-flex;
      padding: $space-1 $space-3;
      border-radius: $radius-full;
      background: #f0eeea;
      color: #52615e;
      font-size: $text-xs;
      font-weight: 900;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .tag-gold { background: #f1eadc; color: #8a6a35; }
    .tag-green { background: #e9f5ed; color: #166534; }

    .detail-header h1 {
      font-size: clamp(1.8rem, 3vw, 2.8rem);
      font-weight: 950;
      letter-spacing: -0.05em;
      line-height: 1.05;
      color: #13211f;
    }

    .detail-address {
      margin-top: $space-2;
      color: #63716e;
      font-size: $text-base;
    }

    .detail-stats {
      display: flex;
      gap: $space-8;
      margin-bottom: $space-8;
      padding: $space-5 $space-6;
      border: 1px solid rgba(#13211f, 0.08);
      border-radius: 16px;
      background: #fff;
    }

    .stat-unit { text-align: center; }
    .stat-unit strong { display: block; color: #13211f; font-size: $text-2xl; font-weight: 950; letter-spacing: -0.04em; }
    .stat-unit span { color: #63716e; font-size: $text-xs; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }

    .section { margin-bottom: $space-8; }

    .section h2 {
      font-size: $text-xl;
      font-weight: 900;
      color: #13211f;
      margin-bottom: $space-4;
      letter-spacing: -0.03em;
    }

    .description {
      color: #47534f;
      font-size: $text-base;
      line-height: 1.8;
    }

    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-3;
    }

    .amenity {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-3 $space-4;
      border: 1px solid rgba(#13211f, 0.08);
      border-radius: 12px;
      background: #fff;
    }

    .amenity svg {
      width: 18px;
      height: 18px;
      color: #8a6a35;
      flex-shrink: 0;
    }

    .amenity span {
      color: #13211f;
      font-size: $text-sm;
    }

    .detail-sidebar {
      position: sticky;
      top: calc($navbar-height + $space-6);
    }

    .booking-card {
      padding: $space-6;
      border: 1px solid rgba(#13211f, 0.1);
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 4px 24px rgba(#13211f, 0.06);
    }

    .booking-header {
      margin-bottom: $space-5;
      padding-bottom: $space-5;
      border-bottom: 1px solid rgba(#13211f, 0.08);
    }

    .booking-price {
      color: #13211f;
      font-size: $text-3xl;
      font-weight: 950;
      letter-spacing: -0.04em;
    }

    .booking-period { color: #63716e; font-size: $text-base; margin-left: $space-1; }

    .booking-trust {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-4;
      margin-bottom: $space-5;
    }

    .trust-label {
      color: #52615e;
      font-size: $text-xs;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .booking-features {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: $space-3;
      margin-bottom: $space-6;
    }

    .booking-features li {
      display: flex;
      align-items: center;
      gap: $space-3;
      color: #52615e;
      font-size: $text-sm;
      font-weight: 600;
    }

    .booking-features svg { color: #166534; flex-shrink: 0; }

    .contact-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $space-2;
      width: 100%;
      padding: $space-4;
      border: 1px solid #13211f;
      border-radius: 14px;
      background: #13211f;
      color: $text-white;
      font-size: $text-sm;
      font-weight: 900;
      transition: background $transition-base;
    }

    .contact-btn:hover:not(:disabled) { background: #2b403b; }
    .contact-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 960px) {
      .detail-layout { grid-template-columns: 1fr; }
      .detail-hero { height: 320px; }
      .amenities-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .detail-hero { height: 240px; }
      .amenities-grid { grid-template-columns: 1fr; }
      .detail-stats { gap: $space-5; padding: $space-4; }
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
