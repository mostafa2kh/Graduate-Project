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
      <section class="search-hero">
        <div class="search-container">
          <div class="page-title">
            <p class="eyebrow">Apartment search</p>
            <h1>{{ resultHeading }}</h1>
          </div>

          <div class="search-bar">
            <label class="search-field wide">
              <span>Destination</span>
              <input placeholder="City, area, or keyword" [(ngModel)]="query" (keyup.enter)="doSearch(true)" />
            </label>
            <label class="search-field">
              <span>City</span>
              <select [(ngModel)]="city" (change)="doSearch(true)">
                <option value="">Any city</option>
                @for (c of filterCities; track c) { <option [value]="c">{{ c }}</option> }
              </select>
            </label>
            <label class="search-field">
              <span>Type</span>
              <select [(ngModel)]="propertyType" (change)="doSearch(true)">
                <option value="">Any type</option>
                @for (t of filterTypes; track t) { <option [value]="t">{{ t }}</option> }
              </select>
            </label>
            <button type="button" class="search-btn" (click)="doSearch(true)">Search</button>
          </div>

          <div class="filter-bar">
            <button type="button" class="filter-chip" [class.active]="furnished" (click)="toggleFurnished()">Furnished</button>
            <label class="filter-input">
              <span>Min</span>
              <input type="number" placeholder="0" [(ngModel)]="minPrice" (change)="doSearch(true)" />
            </label>
            <label class="filter-input">
              <span>Max</span>
              <input type="number" placeholder="Any" [(ngModel)]="maxPrice" (change)="doSearch(true)" />
            </label>
            <label class="filter-input">
              <span>Beds</span>
              <select [(ngModel)]="minBedrooms" (change)="doSearch(true)">
                <option [ngValue]="undefined">Any</option>
                <option [ngValue]="1">1+</option>
                <option [ngValue]="2">2+</option>
                <option [ngValue]="3">3+</option>
                <option [ngValue]="4">4+</option>
              </select>
            </label>
            <label class="filter-input">
              <span>Baths</span>
              <select [(ngModel)]="minBathrooms" (change)="doSearch(true)">
                <option [ngValue]="undefined">Any</option>
                <option [ngValue]="1">1+</option>
                <option [ngValue]="2">2+</option>
                <option [ngValue]="3">3+</option>
              </select>
            </label>
            @if (activeFilterCount > 0) {
              <button type="button" class="filter-clear" (click)="clearFilters()">Clear</button>
            }
          </div>
        </div>
      </section>

      <section class="results-section">
        <div class="search-container">
          <div class="results-toolbar">
            <div>
              <strong>{{ total }} {{ total === 1 ? 'home' : 'homes' }} found</strong>
              <span>{{ filterSummary }}</span>
            </div>
            <div class="toolbar-end">
              <button type="button" class="mobile-filter-btn" (click)="mobileFiltersOpen = true">
                Filters@if (activeFilterCount > 0) { <span class="filter-count">{{ activeFilterCount }}</span> }
              </button>
              <select class="sort-select" [(ngModel)]="sortBy" (change)="doSearch(true)" aria-label="Sort listings">
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>

          @if (loading) {
            <div class="listing-grid">
              @for (_ of skeletonCards; track $index) { <app-skeleton type="card" /> }
            </div>
          } @else if (listings.length === 0) {
            <div class="empty-card">
              <app-empty-state icon="search" title="No listings found" message="Try changing the city, price range, or bedroom count." />
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
        </div>
      </section>

      @if (mobileFiltersOpen) {
        <div class="drawer-backdrop" (click)="mobileFiltersOpen = false">
          <aside class="filter-drawer" (click)="$event.stopPropagation()" aria-label="Mobile filters">
            <div class="drawer-header">
              <div>
                <span class="eyebrow">Filters</span>
                <strong>{{ activeFilterCount }} active</strong>
              </div>
              <button type="button" (click)="mobileFiltersOpen = false" aria-label="Close filters">&times;</button>
            </div>

            <label class="drawer-field">
              <span>Min price</span>
              <input type="number" placeholder="0" [(ngModel)]="minPrice" />
            </label>
            <label class="drawer-field">
              <span>Max price</span>
              <input type="number" placeholder="Any" [(ngModel)]="maxPrice" />
            </label>
            <label class="drawer-field">
              <span>Bedrooms</span>
              <select [(ngModel)]="minBedrooms">
                <option [ngValue]="undefined">Any</option>
                <option [ngValue]="1">1+</option>
                <option [ngValue]="2">2+</option>
                <option [ngValue]="3">3+</option>
                <option [ngValue]="4">4+</option>
              </select>
            </label>
            <label class="drawer-field">
              <span>Bathrooms</span>
              <select [(ngModel)]="minBathrooms">
                <option [ngValue]="undefined">Any</option>
                <option [ngValue]="1">1+</option>
                <option [ngValue]="2">2+</option>
                <option [ngValue]="3">3+</option>
              </select>
            </label>
            <label class="drawer-check">
              <input type="checkbox" [(ngModel)]="furnished" />
              <span>Furnished homes only</span>
            </label>

            <div class="drawer-actions">
              <button type="button" class="filter-clear" (click)="clearFilters(); mobileFiltersOpen = false">Clear</button>
              <button type="button" class="search-btn" (click)="doSearch(true); mobileFiltersOpen = false">Apply</button>
            </div>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .search-page { min-height: 100vh; background: #fbfaf6; color: #13211f; }
    .search-container { width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 $space-6; }

    .search-hero {
      padding: $space-10 0 $space-6;
      background: #fff;
      border-bottom: 1px solid rgba(#13211f, 0.08);
      position: sticky;
      top: $navbar-height;
      z-index: 10;
    }

    .page-title { margin-bottom: $space-6; }
    .eyebrow { color: #8a6a35; font-size: $text-xs; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; }
    .page-title h1 { margin-top: $space-2; color: #13211f; font-size: clamp(1.8rem, 3.5vw, 3.2rem); line-height: 1.03; letter-spacing: -0.055em; }

    .search-bar {
      display: grid;
      grid-template-columns: minmax(240px, 1.4fr) minmax(140px, 0.7fr) minmax(140px, 0.7fr) auto;
      gap: $space-3;
      align-items: stretch;
    }

    .search-field, .filter-input, .drawer-field {
      display: flex;
      flex-direction: column;
      gap: $space-1;
      padding: $space-3 $space-4;
      border: 1px solid rgba(#13211f, 0.12);
      border-radius: 12px;
      background: #fff;
    }

    .search-field span, .filter-input span, .drawer-field span {
      color: #78837f;
      font-size: 0.68rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .search-field input, .search-field select, .filter-input input, .filter-input select, .drawer-field input, .drawer-field select, .sort-select {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      color: #13211f;
      font-size: $text-sm;
      font-weight: 800;
    }

    .search-field input::placeholder, .filter-input input::placeholder, .drawer-field input::placeholder { color: #9aa4a1; }

    .search-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 $space-6;
      border: 1px solid #13211f;
      border-radius: 12px;
      background: #13211f;
      color: $text-white;
      font-size: $text-sm;
      font-weight: 900;
      transition: background $transition-base;
    }

    .search-btn:hover { background: #2b403b; }

    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: $space-3;
      align-items: stretch;
      margin-top: $space-4;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      padding: 0 $space-4;
      border: 1px solid rgba(#13211f, 0.14);
      border-radius: 12px;
      background: #fff;
      color: #13211f;
      font-size: $text-sm;
      font-weight: 800;
      transition: all $transition-base;
    }

    .filter-chip:hover { border-color: #13211f; }
    .filter-chip.active { background: #13211f; border-color: #13211f; color: $text-white; }

    .filter-input {
      flex-direction: row;
      align-items: center;
      gap: $space-2;
      padding: $space-2 $space-3;
      min-width: 110px;
    }

    .filter-input span { font-size: $text-xs; }

    .filter-clear {
      display: inline-flex;
      align-items: center;
      padding: 0 $space-4;
      border: 1px solid rgba(#13211f, 0.14);
      border-radius: 12px;
      background: #fff;
      color: #8a6a35;
      font-size: $text-sm;
      font-weight: 900;
      transition: all $transition-base;
    }

    .filter-clear:hover { border-color: #8a6a35; }

    .results-section { padding: $space-8 0 $space-16; }

    .results-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-4;
      margin-bottom: $space-5;
    }

    .results-toolbar strong, .results-toolbar span { display: block; }
    .results-toolbar strong { color: #13211f; font-size: $text-lg; }
    .results-toolbar span { margin-top: 2px; color: #63716e; font-size: $text-sm; }

    .toolbar-end { display: flex; align-items: center; gap: $space-3; }
    .mobile-filter-btn { display: none; }
    .mobile-filter-btn span { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; border-radius: 50%; background: #dac49b; color: #13211f; font-size: $text-xs; }

    .sort-select { min-width: 170px; min-height: 44px; padding: 0 $space-4; border: 1px solid rgba(#13211f, 0.14); border-radius: 12px; background: #fff; }

    .listing-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: $space-5;
    }

    .empty-card { padding: $space-12; border: 1px solid rgba(#13211f, 0.08); border-radius: 18px; background: #fff; }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: $space-2;
      margin-top: $space-10;
    }

    .page-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      min-height: 40px;
      padding: 0 $space-3;
      border: 1px solid rgba(#13211f, 0.14);
      border-radius: $radius-full;
      background: #fff;
      color: #13211f;
      font-size: $text-sm;
      font-weight: 800;
      transition: all $transition-base;
    }

    .page-btn:hover:not(:disabled) { border-color: #13211f; }
    .page-btn.active { background: #13211f; border-color: #13211f; color: $text-white; }
    .page-btn:disabled { opacity: 0.45; cursor: not-allowed; }

    .drawer-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1200;
      display: flex;
      justify-content: flex-end;
      background: rgba(#13211f, 0.48);
    }

    .filter-drawer {
      width: min(420px, 100%);
      height: 100%;
      overflow-y: auto;
      padding: $space-6;
      background: #fff;
      box-shadow: -20px 0 80px rgba(#13211f, 0.28);
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-4;
      margin-bottom: $space-6;
    }

    .drawer-header span, .drawer-header strong { display: block; }
    .drawer-header strong { margin-top: $space-1; font-size: $text-xl; }
    .drawer-header button { width: 40px; height: 40px; border: 1px solid rgba(#13211f, 0.16); border-radius: 50%; background: #fff; color: #13211f; font-size: $text-2xl; line-height: 1; }

    .drawer-field { margin-bottom: $space-4; }

    .drawer-check {
      display: flex;
      align-items: center;
      gap: $space-3;
      margin: $space-6 0;
      color: #13211f;
      font-weight: 800;
    }

    .drawer-actions { display: grid; grid-template-columns: 1fr 1fr; gap: $space-3; }

    @media (max-width: 1080px) {
      .listing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .search-bar { grid-template-columns: 1fr 1fr; }
      .search-btn { min-height: 50px; }
    }

    @media (max-width: 760px) {
      .search-container { padding: 0 $space-4; }
      .page-title { margin-bottom: $space-4; }
      .search-bar { grid-template-columns: 1fr; }
      .filter-bar { display: none; }
      .results-toolbar { flex-direction: column; align-items: flex-start; }
      .toolbar-end { width: 100%; flex-direction: column; }
      .mobile-filter-btn { display: inline-flex; align-items: center; justify-content: center; gap: $space-2; min-height: 44px; padding: 0 $space-5; border: 1px solid rgba(#13211f, 0.14); border-radius: 12px; background: #fff; color: #13211f; font-size: $text-sm; font-weight: 800; }
      .sort-select { width: 100%; }
      .listing-grid { grid-template-columns: 1fr; }
      .drawer-actions { grid-template-columns: 1fr; }
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
  skeletonCards = Array.from({ length: 6 });

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
      this.propertyType || 'All home types',
      this.minBedrooms ? `${this.minBedrooms}+ beds` : 'Any beds',
      this.furnished ? 'Furnished' : 'All furnishing',
    ];
    return parts.join(' - ');
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
      this.sortBy = p['sortBy'] || p['sort'] || 'newest';
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
    if (this.sortBy && this.sortBy !== 'newest') params['sortBy'] = this.sortBy;
    if (this.page > 0) params['page'] = this.page;
    if (this.size !== 20) params['size'] = this.size;
    return params;
  }

  private toOptionalNumber(value: any): number | undefined {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : undefined;
  }
}
