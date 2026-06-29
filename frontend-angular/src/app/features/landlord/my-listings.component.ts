import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ListingService } from '../../core/services/listing.service';
import { ListingSummary } from '../../core/models/listing.models';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [RouterLink, DatePipe, BadgeComponent, SkeletonComponent, EmptyStateComponent, TableComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Listings</h1>
          <p class="page-subtitle">Manage your rental properties</p>
        </div>
        <a routerLink="/dashboard/listings/create" class="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Listing
        </a>
      </div>

      @if (loading) {
        <app-skeleton type="table-row" [columns]="['25%','15%','12%','12%','10%','10%']" />
        <app-skeleton type="table-row" [columns]="['25%','15%','12%','12%','10%','10%']" />
        <app-skeleton type="table-row" [columns]="['25%','15%','12%','12%','10%','10%']" />
      } @else if (listings.length === 0) {
        <app-empty-state title="No listings yet" message="Create your first rental listing to get started" icon="folder">
          <a routerLink="/dashboard/listings/create" class="btn-primary">Create Listing</a>
        </app-empty-state>
      } @else {
        <app-table
          [columns]="columns"
          [data]="listings"
          trackBy="id"
          [showFooter]="true"
          [rowActions]="actionsTpl"
          (rowClick)="viewListing($event)"
        />

        <ng-template #actionsTpl let-row>
          <button class="btn-outline btn-sm" (click)="$event.stopPropagation(); viewListing(row)">View</button>
        </ng-template>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .page-container {
      padding: $space-8;

      @include sm { padding: $space-4; }
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: $space-8;

      @include sm { flex-direction: column; align-items: flex-start; gap: $space-4; }
    }

    .page-title {
      font-size: $text-2xl;
      font-weight: 800;
    }

    .page-subtitle {
      font-size: $text-sm;
      color: $text-muted;
      margin-top: $space-1;
    }
  `]
})
export class MyListingsComponent implements OnInit {
  listings: ListingSummary[] = [];
  loading = true;

  columns: TableColumn[] = [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' },
    { key: 'city', label: 'City' },
    { key: 'bedrooms', label: 'Beds' },
    { key: 'bathrooms', label: 'Baths' },
  ];

  constructor(
    private listingService: ListingService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  private loadListings(): void {
    this.listingService.getMyListings().subscribe({
      next: (res) => {
        this.listings = res.data?.content || [];
        this.loading = false;
      },
      error: () => {
        this.toast.show('Failed to load listings', 'error');
        this.loading = false;
      }
    });
  }

  viewListing(listing: ListingSummary): void {
    this.router.navigate(['/dashboard/listings', listing.id]);
  }
}
