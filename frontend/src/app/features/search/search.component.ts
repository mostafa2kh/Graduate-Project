import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, FormsModule, BadgeComponent, SkeletonComponent, EmptyStateComponent, ListingCardComponent],
  template: `
    <div class="page">
      <div class="search-hero">
        <div class="container">
          <h1 class="hero-title">Find Your Perfect Rental</h1>
          <div class="search-bar">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input class="search-input" placeholder="Search by city, area, or keyword..." [(ngModel)]="query" (keyup.enter)="doSearch()" />
            <button class="btn-primary" (click)="doSearch()">Search</button>
          </div>
        </div>
      </div>

      <div class="container layout">
        <aside class="filter-sidebar" [class.open]="mobileFiltersOpen">
          <div class="filter-header">
            <h3>Filters</h3>
            <button class="btn-ghost btn-sm" (click)="clearFilters()">Clear All</button>
            <button class="btn-ghost btn-sm close-filters" (click)="mobileFiltersOpen = false">&times;</button>
          </div>

          <div class="filter-group">
            <label class="filter-label">City</label>
            <select class="input-field" [(ngModel)]="city" (change)="doSearch()">
              <option value="">All Cities</option>
              @for (c of filterCities; track c) { <option [value]="c">{{ c }}</option> }
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Property Type</label>
            <select class="input-field" [(ngModel)]="propertyType" (change)="doSearch()">
              <option value="">All Types</option>
              @for (t of filterTypes; track t) { <option [value]="t">{{ t }}</option> }
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Min Price</label>
            <input type="number" class="input-field" placeholder="0" [(ngModel)]="minPrice" (change)="doSearch()" />
          </div>
          <div class="filter-group">
            <label class="filter-label">Max Price</label>
            <input type="number" class="input-field" placeholder="Any" [(ngModel)]="maxPrice" (change)="doSearch()" />
          </div>

          <div class="filter-group">
            <label class="filter-label">Bedrooms</label>
            <select class="input-field" [(ngModel)]="minBedrooms" (change)="doSearch()">
              <option [value]="undefined">Any</option>
              <option [value]="1">1+</option>
              <option [value]="2">2+</option>
              <option [value]="3">3+</option>
              <option [value]="4">4+</option>
              <option [value]="5">5+</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Bathrooms</label>
            <select class="input-field" [(ngModel)]="minBathrooms" (change)="doSearch()">
              <option [value]="undefined">Any</option>
              <option [value]="1">1+</option>
              <option [value]="2">2+</option>
              <option [value]="3">3+</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="furnished" (change)="doSearch()" />
              <span>Furnished only</span>
            </label>
          </div>

          <div class="filter-actions-mobile">
            <button class="btn-primary" (click)="doSearch(); mobileFiltersOpen = false;">Apply Filters</button>
          </div>
        </aside>
        @if (mobileFiltersOpen) { <div class="overlay" (click)="mobileFiltersOpen = false"></div> }

        <main class="results">
          <div class="results-toolbar">
            <button class="btn-outline btn-sm filter-toggle" (click)="mobileFiltersOpen = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
              Filters
            </button>
            <p class="result-count">{{ total }} {{ total === 1 ? 'result' : 'results' }}</p>
            <select class="input-field sort-select" [(ngModel)]="sortBy" (change)="doSearch()">
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          @if (loading) {
            <div class="grid">
              @for (_ of [].constructor(6); track $index) { <app-skeleton type="card" /> }
            </div>
          } @else if (listings.length === 0) {
            <app-empty-state icon="search" title="No listings found" message="Try adjusting your filters or search query." />
          } @else {
            <div class="grid">
              @for (l of listings; track l.id) {
                <app-listing-card [listing]="l" link="/search/{{ l.id }}" />
              }
            </div>
            @if (totalPages > 1) {
              <div class="pagination">
                <button class="btn-outline btn-sm" [disabled]="page === 0" (click)="goToPage(page - 1)">Previous</button>
                @for (p of pages; track p) {
                  <button class="btn-outline btn-sm" [class.btn-primary]="p === page" (click)="goToPage(p)">{{ p + 1 }}</button>
                }
                <button class="btn-outline btn-sm" [disabled]="page >= totalPages - 1" (click)="goToPage(page + 1)">Next</button>
              </div>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .page { min-height: 100vh; }
    .search-hero { background: linear-gradient(135deg, $primary 0%, $secondary 100%); padding: $space-16 $space-4; color: white; text-align: center; }
    .hero-title { font-size: $text-3xl; font-weight: 800; margin-bottom: $space-6; @include sm { font-size: $text-2xl; } }
    .search-bar { max-width: 600px; margin: 0 auto; display: flex; background: white; border-radius: $radius-full; overflow: hidden; box-shadow: $shadow-lg; align-items: center; padding-left: $space-4; gap: $space-2; }
    .search-icon { color: $text-muted; flex-shrink: 0; }
    .search-input { flex: 1; border: none; padding: $space-3 0; font-size: $text-base; outline: none; background: transparent; }
    .layout { display: grid; grid-template-columns: 260px 1fr; gap: $space-6; padding-top: $space-8; padding-bottom: $space-12; @include md { grid-template-columns: 1fr; } }
    .filter-sidebar { background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; padding: $space-6; height: fit-content; position: sticky; top: $space-4; @include md { display: none; position: fixed; inset: 0; z-index: 200; overflow-y: auto; border-radius: 0; &.open { display: block; } } }
    .overlay { display: none; @include md { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 150; } }
    .filter-header { display: flex; align-items: center; gap: $space-2; margin-bottom: $space-6; h3 { font-size: $text-lg; font-weight: 700; flex: 1; } }
    .close-filters { display: none; @include md { display: inline-flex; } }
    .filter-group { margin-bottom: $space-4; }
    .filter-label { display: block; font-size: $text-sm; font-weight: 600; margin-bottom: $space-1; color: $text-muted; }
    .checkbox-label { display: flex; align-items: center; gap: $space-2; font-size: $text-sm; cursor: pointer; }
    .filter-actions-mobile { display: none; @include md { display: block; margin-top: $space-6; } }
    .results { min-height: 400px; }
    .results-toolbar { display: flex; align-items: center; gap: $space-3; margin-bottom: $space-6; }
    .filter-toggle { display: none; @include md { display: inline-flex; } }
    .result-count { font-size: $text-sm; color: $text-muted; flex: 1; }
    .sort-select { width: auto; min-width: 180px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-6; @include lg { grid-template-columns: repeat(2, 1fr); } @include sm { grid-template-columns: 1fr; } }
    .pagination { display: flex; align-items: center; justify-content: center; gap: $space-2; margin-top: $space-8; }
  `]
})
export class SearchComponent implements OnInit {
  query = '';
  city = '';
  propertyType = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minBedrooms: number | undefined;
  minBathrooms: number | undefined;
  furnished: boolean | undefined;
  sortBy = 'newest';
  page = 0;
  size = 20;

  listings: any[] = [];
  total = 0;
  totalPages = 0;
  loading = false;

  filterCities: string[] = [];
  filterTypes: string[] = [];
  mobileFiltersOpen = false;

  get pages(): number[] {
    const total = Math.min(this.totalPages, 10);
    const start = Math.max(0, Math.min(this.page - Math.floor(total / 2), this.totalPages - total));
    return Array.from({ length: total }, (_, i) => start + i);
  }

  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.query = p['q'] || '';
      this.city = p['city'] || '';
      this.propertyType = p['type'] || '';
      this.minPrice = p['minPrice'] ? +p['minPrice'] : undefined;
      this.maxPrice = p['maxPrice'] ? +p['maxPrice'] : undefined;
      this.minBedrooms = p['bedrooms'] ? +p['bedrooms'] : undefined;
      this.sortBy = p['sort'] || 'newest';
      this.page = p['page'] ? +p['page'] : 0;
      this.loadFilterOptions();
      this.doSearch();
    });
  }

  loadFilterOptions(): void {
    this.searchService.getFilterOptions().subscribe({
      next: (res: any) => { const d = res.data || res; this.filterCities = d.cities || []; this.filterTypes = d.propertyTypes || []; },
      error: () => {}
    });
  }

  doSearch(): void {
    this.loading = true;
    const params: any = {};
    if (this.query) params['q'] = this.query;
    if (this.city) params['city'] = this.city;
    if (this.propertyType) params['propertyType'] = this.propertyType;
    if (this.minPrice != null) params['minPrice'] = this.minPrice;
    if (this.maxPrice != null) params['maxPrice'] = this.maxPrice;
    if (this.minBedrooms != null) params['minBedrooms'] = this.minBedrooms;
    if (this.minBathrooms != null) params['minBathrooms'] = this.minBathrooms;
    if (this.furnished) params['furnished'] = true;
    params['sortBy'] = this.sortBy;
    params['page'] = this.page;
    params['size'] = this.size;

    this.router.navigate([], { queryParams: params, replaceUrl: true });

    this.searchService.search(params).subscribe({
      next: (res: any) => {
        const d = res.data || res;
        this.listings = d.items || d.content || d;
        this.total = d.totalItems || d.totalElements || d.length || 0;
        this.totalPages = d.totalPages || Math.ceil(this.total / this.size) || 0;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  clearFilters(): void {
    this.city = '';
    this.propertyType = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.minBedrooms = undefined;
    this.minBathrooms = undefined;
    this.furnished = undefined;
    this.page = 0;
    this.doSearch();
  }

  goToPage(p: number): void { this.page = p; this.doSearch(); }
}
