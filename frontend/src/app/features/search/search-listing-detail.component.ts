import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SearchService } from '../../core/services/search.service';
import { ChatService } from '../../core/services/chat.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { TrustScoreComponent } from '../../shared/components/trust-score/trust-score.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-search-listing-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, BadgeComponent, SkeletonComponent, TrustScoreComponent],
  template: `
    <div class="container" style="padding: 2rem 0;">
      <a routerLink="/search" class="back-link">&larr; Back to Search</a>

      @if (loading) {
        <app-skeleton type="card" />
        <div style="margin-top: 1rem"><app-skeleton type="card" /></div>
      } @else if (listing) {
        <div class="detail-header">
          <div>
            <h1 class="detail-title">{{ listing.title }}</h1>
            <p class="detail-location">{{ listing.city }}{{ listing.area ? ', ' + listing.area : '' }}{{ listing.state ? ', ' + listing.state : '' }}</p>
          </div>
          <div class="detail-price">
            <span class="price">{{ listing.currency || '$' }}{{ listing.price?.toLocaleString() }}</span>
            <span class="period">/month</span>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-main">
            @if (listing.primaryImageUrl) {
              <div class="main-image">
                <img [src]="listing.primaryImageUrl" [alt]="listing.title" />
              </div>
            }

            <div class="section">
              <h2 class="section-title">Description</h2>
              <p class="description">{{ listing.description || 'No description provided.' }}</p>
            </div>

            <div class="section">
              <h2 class="section-title">Features</h2>
              <div class="features-grid">
                <div class="feature-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  <span class="feature-label">Property Type</span>
                  <span class="feature-value">{{ listing.propertyType || 'N/A' }}</span>
                </div>
                <div class="feature-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  <span class="feature-label">Bedrooms</span>
                  <span class="feature-value">{{ listing.bedrooms || 0 }}</span>
                </div>
                <div class="feature-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span class="feature-label">Bathrooms</span>
                  <span class="feature-value">{{ listing.bathrooms || 0 }}</span>
                </div>
                <div class="feature-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span class="feature-label">Area</span>
                  <span class="feature-value">{{ listing.areaSize || 'N/A' }} {{ listing.areaUnit || '' }}</span>
                </div>
                <div class="feature-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  <span class="feature-label">Furnished</span>
                  <span class="feature-value">{{ listing.furnished ? 'Yes' : 'No' }}</span>
                </div>
              </div>
            </div>
          </div>

          <aside class="detail-sidebar">
            <div class="sidebar-card">
              <h3 class="sidebar-title">Trust Score</h3>
              <app-trust-score [score]="listing.trustScore || 0" />
            </div>
            <div class="sidebar-card">
              <button class="btn-primary btn-full" (click)="contactLandlord()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                Contact Landlord
              </button>
            </div>
          </aside>
        </div>
      } @else {
        <div class="not-found"><h2>Listing not found</h2><p>This listing may not be available.</p></div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .back-link { display: inline-block; font-size: $text-sm; color: $primary; text-decoration: none; margin-bottom: $space-6; font-weight: 500; &:hover { text-decoration: underline; } }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: $space-8; flex-wrap: wrap; gap: $space-4; }
    .detail-title { font-size: $text-3xl; font-weight: 800; }
    .detail-location { font-size: $text-sm; color: $text-muted; margin-top: $space-1; }
    .detail-price { text-align: right; .price { font-size: $text-2xl; font-weight: 800; color: $primary; } .period { font-size: $text-sm; color: $text-muted; } }
    .detail-grid { display: grid; grid-template-columns: 1fr 320px; gap: $space-8; @include md { grid-template-columns: 1fr; } }
    .main-image { border-radius: $radius-lg; overflow: hidden; margin-bottom: $space-8; img { width: 100%; max-height: 500px; object-fit: cover; } }
    .section { margin-bottom: $space-8; }
    .section-title { font-size: $text-xl; font-weight: 700; margin-bottom: $space-4; padding-bottom: $space-2; border-bottom: 2px solid $primary; display: inline-block; }
    .description { font-size: $text-base; line-height: 1.7; color: $text-dark; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-4; @include sm { grid-template-columns: repeat(2, 1fr); } }
    .feature-card { background: $bg-light; border-radius: $radius-md; padding: $space-4; text-align: center; svg { width: 24px; height: 24px; color: $primary; margin-bottom: $space-2; } }
    .feature-label { display: block; font-size: $text-xs; color: $text-muted; text-transform: uppercase; }
    .feature-value { font-size: $text-base; font-weight: 700; }
    .sidebar-card { background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; padding: $space-6; position: sticky; top: $space-4; }
    .sidebar-title { font-size: $text-lg; font-weight: 700; margin-bottom: $space-4; }
    .btn-primary.btn-full { width: 100%; display: flex; align-items: center; justify-content: center; gap: $space-2; padding: $space-3; border: none; border-radius: $radius-md; background: $primary; color: white; font-weight: 600; font-size: $text-sm; cursor: pointer; transition: background $transition-base; &:hover { background: $primary-dark; } svg { flex-shrink: 0; } }
    .sidebar-card + .sidebar-card { margin-top: $space-4; }
    .not-found { text-align: center; padding: $space-16; h2 { font-size: $text-2xl; } p { color: $text-muted; } }
  `]
})
export class SearchListingDetailComponent implements OnInit {
  listing: any = null; loading = true;
  contacting = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private chatService: ChatService,
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
