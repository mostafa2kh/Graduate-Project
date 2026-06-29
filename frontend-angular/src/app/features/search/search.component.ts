import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, FormsModule, SkeletonComponent, EmptyStateComponent, ListingCardComponent],
  template: `
    <div class="search-page">
      <div class="search-layout">
        <aside class="filter-sidebar">
          <div class="filter-header">
            <h3>Filters</h3>
            @if (activeFilterCount > 0) {
              <button type="button" class="filter-clear" (click)="clearFilters()">Clear all</button>
            }
          </div>

          <div class="filter-section">
            <h4 class="filter-label">Property Type</h4>
            <div class="filter-chips">
              @for (t of filterTypes; track t) {
                <button type="button" class="chip" [class.active]="propertyType === t" (click)="propertyType = t; doSearch(true)">
                  {{ t }}
                </button>
              }
            </div>
          </div>

          <div class="filter-section">
            <h4 class="filter-label">City</h4>
            <select class="filter-select" [(ngModel)]="city" (change)="doSearch(true)">
              <option value="">All cities</option>
              @for (c of filterCities; track c) { <option [value]="c">{{ c }}</option> }
            </select>
          </div>

          <div class="filter-section">
            <h4 class="filter-label">Price Range</h4>
            <div class="price-inputs">
              <input type="number" class="filter-input" placeholder="Min" [(ngModel)]="minPrice" (change)="doSearch(true)" />
              <span class="price-sep">—</span>
              <input type="number" class="filter-input" placeholder="Max" [(ngModel)]="maxPrice" (change)="doSearch(true)" />
            </div>
          </div>

          <div class="filter-section">
            <h4 class="filter-label">Bedrooms</h4>
            <div class="filter-chips">
              @for (b of bedroomOptions; track b.value) {
                <button type="button" class="chip" [class.active]="minBedrooms === b.value" (click)="minBedrooms = minBedrooms === b.value ? undefined : b.value; doSearch(true)">
                  {{ b.label }}
                </button>
              }
            </div>
          </div>

          <div class="filter-section">
            <h4 class="filter-label">Bathrooms</h4>
            <div class="filter-chips">
              @for (b of bathroomOptions; track b.value) {
                <button type="button" class="chip" [class.active]="minBathrooms === b.value" (click)="minBathrooms = minBathrooms === b.value ? undefined : b.value; doSearch(true)">
                  {{ b.label }}
                </button>
              }
            </div>
          </div>

          <div class="filter-section">
            <label class="filter-checkbox">
              <input type="checkbox" [checked]="furnished" (change)="toggleFurnished()" />
              <span>Furnished only</span>
            </label>
          </div>
        </aside>

        <main class="search-main">
          <div class="search-bar">
            <div class="search-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon" width="18" height="18">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                class="search-input"
                placeholder="Search city, area, or keyword"
                [(ngModel)]="query"
                (keyup.enter)="doSearch(true)"
              />
            </div>
          </div>

          <div class="results-header">
            <div class="results-count">
              <strong>{{ total }} {{ total === 1 ? 'home' : 'homes' }}</strong>
              <span>{{ filterSummary }}</span>
            </div>
            <select class="sort-select" [(ngModel)]="sortBy" (change)="doSearch(true)" aria-label="Sort listings">
              <option value="bestMatch">Best match</option>
              <option value="newest">New arrivals</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          @if (loading) {
            <div class="listing-grid">
              @for (_ of skeletonCards; track $index) { <app-skeleton type="card" /> }
            </div>
          } @else if (listings.length === 0) {
            <div class="empty-card">
              <app-empty-state icon="search" title="No listings found" message="Try changing the filters above." />
            </div>
          } @else {
            <div class="listing-grid">
              @for (l of listings; track l.id) {
                <app-listing-card [listing]="l" [link]="'/search/' + l.id" />
              }
            </div>

            @if (totalPages > 1) {
              <div class="pagination">
                <button type="button" class="page-btn" [disabled]="page === 0" (click)="goToPage(page - 1)">Previous</button>
                @for (p of pages; track p) {
                  <button type="button" class="page-btn" [class.active]="p === page" (click)="goToPage(p)">{{ p + 1 }}</button>
                }
                <button type="button" class="page-btn" [disabled]="page >= totalPages - 1" (click)="goToPage(page + 1)">Next</button>
              </div>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .search-page {
      min-height: 100vh;
      background: #F7F7F7;
    }

    .search-layout {
      display: flex;
      max-width: 1320px;
      margin: 0 auto;
      padding: 24px 20px;
      gap: 28px;
    }

    .filter-sidebar {
      width: 260px;
      flex-shrink: 0;
    }

    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .filter-header h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #0D0D0D;
    }

    .filter-clear {
      border: none;
      background: none;
      color: #FB6E44;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
    }

    .filter-clear:hover { text-decoration: underline; }

    .filter-section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(#0D0D0D, 0.08);
    }

    .filter-label {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #0D0D0D;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border: 1px solid rgba(#0D0D0D, 0.12);
      border-radius: 100px;
      background: #fff;
      color: #0D0D0D;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .chip:hover { border-color: #FB6E44; color: #FB6E44; }
    .chip.active { background: #FB6E44; border-color: #FB6E44; color: #fff; }

    .filter-select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid rgba(#0D0D0D, 0.12);
      border-radius: 8px;
      background: #fff;
      color: #0D0D0D;
      font-size: 0.875rem;
      outline: none;
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .price-inputs .filter-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid rgba(#0D0D0D, 0.12);
      border-radius: 8px;
      background: #fff;
      font-size: 0.875rem;
      outline: none;
      width: 100%;
    }

    .price-inputs .filter-input:focus { border-color: #FB6E44; }

    .price-sep { color: #c7c7c7; }

    .filter-checkbox {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 0.875rem;
      color: #0D0D0D;
    }

    .filter-checkbox input {
      width: 18px;
      height: 18px;
      accent-color: #FB6E44;
    }

    .search-main {
      flex: 1;
      min-width: 0;
    }

    .search-bar {
      margin-bottom: 20px;
    }

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid rgba(#0D0D0D, 0.1);
      border-radius: 12px;
      background: #fff;
      transition: border-color 0.2s ease;
    }

    .search-input-wrap:focus-within { border-color: #FB6E44; }

    .search-icon { color: #c7c7c7; flex-shrink: 0; }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.9375rem;
      color: #0D0D0D;
    }

    .search-input::placeholder { color: #c7c7c7; }

    .results-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }

    .results-count strong {
      display: block;
      color: #0D0D0D;
      font-size: 1rem;
      font-weight: 700;
    }

    .results-count span {
      display: block;
      margin-top: 2px;
      color: #676767;
      font-size: 0.8125rem;
    }

    .sort-select {
      min-width: 160px;
      padding: 10px 12px;
      border: 1px solid rgba(#0D0D0D, 0.12);
      border-radius: 8px;
      background: #fff;
      color: #0D0D0D;
      font-size: 0.8125rem;
      outline: none;
    }

    .listing-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

    .empty-card {
      padding: 48px;
      border: 1px solid rgba(#0D0D0D, 0.08);
      border-radius: 16px;
      background: #fff;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 40px;
    }

    .page-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      min-height: 40px;
      padding: 0 14px;
      border: 1px solid rgba(#0D0D0D, 0.12);
      border-radius: 100px;
      background: #fff;
      color: #0D0D0D;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .page-btn:hover:not(:disabled) { border-color: #FB6E44; color: #FB6E44; }
    .page-btn.active { background: #FB6E44; border-color: #FB6E44; color: #fff; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    @media (max-width: 960px) {
      .search-layout { flex-direction: column; }
      .filter-sidebar { width: 100%; }
      .listing-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .search-layout { padding: 16px 12px; gap: 16px; }
      .results-header { flex-direction: column; align-items: flex-start; }
      .sort-select { width: 100%; }
    }
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
  sortBy = 'bestMatch';
  page = 0;
  size = 20;

  listings: any[] = [];
  total = 0;
  totalPages = 0;
  loading = false;

  filterCities: string[] = [];
  filterTypes: string[] = [];
  skeletonCards = Array.from({ length: 6 });

  bedroomOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4+' },
  ];

  bathroomOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3+' },
  ];

  get pages(): number[] {
    const total = Math.min(this.totalPages, 10);
    const start = Math.max(0, Math.min(this.page - Math.floor(total / 2), this.totalPages - total));
    return Array.from({ length: total }, (_, i) => start + i);
  }

  get resultHeading(): string { return this.city ? `Apartments in ${this.city}` : 'Explore apartments'; }

  get activeFilterCount(): number {
    return [this.city, this.propertyType, this.minPrice, this.maxPrice, this.minBedrooms, this.minBathrooms, this.furnished].filter(v => v != null && v !== '').length;
  }

  get filterSummary(): string {
    const parts = [
      this.propertyType || 'All types',
      this.minBedrooms ? `${this.minBedrooms}+ beds` : '',
      this.furnished ? 'Furnished' : '',
    ];
    return parts.filter(Boolean).join(' - ') || 'All homes';
  }

  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.route.queryParams.subscribe(p => {
      this.query = p['q'] || p['query'] || '';
      this.city = p['city'] || '';
      this.propertyType = p['propertyType'] || p['type'] || '';
      this.minPrice = this.toOptionalNumber(p['minPrice']);
      this.maxPrice = this.toOptionalNumber(p['maxPrice']);
      this.minBedrooms = this.toOptionalNumber(p['minBedrooms'] || p['bedrooms']);
      this.minBathrooms = this.toOptionalNumber(p['minBathrooms'] || p['bathrooms']);
      this.furnished = p['furnished'] === 'true' ? true : undefined;
      this.sortBy = p['sortBy'] || p['sort'] || 'bestMatch';
      this.page = this.toOptionalNumber(p['page']) || 0;
      this.size = this.toOptionalNumber(p['size']) || 20;
      this.fetchListings();
    });
  }

  loadFilterOptions(): void {
    this.searchService.getFilterOptions().subscribe({
      next: (res: any) => { const d = res.data || res; this.filterCities = d.cities || []; this.filterTypes = d.propertyTypes || []; },
      error: () => {}
    });
  }

  doSearch(resetPage = false): void {
    if (resetPage) this.page = 0;
    this.router.navigate([], { queryParams: this.buildQueryParams(), replaceUrl: true });
  }

  fetchListings(): void {
    this.loading = true;
    const params = this.buildQueryParams();

    this.searchService.search(params).subscribe({
      next: (res: any) => {
        const d = res.data || res;
        this.listings = d.items || d.content || d || [];
        this.total = d.totalItems || d.totalElements || this.listings.length || 0;
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

  toggleFurnished(): void {
    this.furnished = this.furnished ? undefined : true;
    this.doSearch(true);
  }

  private buildQueryParams(): any {
    const params: any = {};
    if (this.query?.trim()) params['q'] = this.query.trim();
    if (this.city) params['city'] = this.city;
    if (this.propertyType) params['propertyType'] = this.propertyType;
    if (this.minPrice != null) params['minPrice'] = this.minPrice;
    if (this.maxPrice != null) params['maxPrice'] = this.maxPrice;
    if (this.minBedrooms != null) params['minBedrooms'] = this.minBedrooms;
    if (this.minBathrooms != null) params['minBathrooms'] = this.minBathrooms;
    if (this.furnished) params['furnished'] = true;
    if (this.sortBy && this.sortBy !== 'bestMatch') params['sortBy'] = this.sortBy;
    if (this.page > 0) params['page'] = this.page;
    if (this.size !== 20) params['size'] = this.size;
    return params;
  }

  private toOptionalNumber(value: any): number | undefined {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : undefined;
  }
}
