import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-listings',
  standalone: true,
  imports: [RouterLink, DatePipe, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="admin-listings">
      <div class="page-header">
        <h1 class="page-title">Listing Moderation</h1>
        <p class="page-subtitle">Review and approve or reject submitted listings</p>
      </div>

      @if (loading) {
        <app-skeleton type="table-row" />
      } @else if (listings.length === 0) {
        <app-empty-state icon="default" title="No Pending Listings" message="All listings have been reviewed." />
      } @else {
        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Location</th>
                <th>Trust Score</th>
                <th>Flags</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (item of listings; track item.listingId) {
                <tr>
                  <td class="title-cell">{{ item.title }}</td>
                  <td><app-badge variant="primary">{{ item.propertyType }}</app-badge></td>
                  <td><strong>{{ item.currency || 'USD' }} {{ item.price?.toLocaleString() }}</strong></td>
                  <td class="text-muted">{{ item.city }}{{ item.area ? ', ' + item.area : '' }}</td>
                  <td>
                    <span class="score" [class.high]="item.trustScore >= 70"
                          [class.medium]="item.trustScore >= 40 && item.trustScore < 70"
                          [class.low]="item.trustScore < 40">
                      {{ item.trustScore }}
                    </span>
                  </td>
                  <td><app-badge [variant]="item.flagCount > 0 ? 'warning' : 'success'">{{ item.flagCount }}</app-badge></td>
                  <td class="text-muted">{{ item.createdAt | date:'mediumDate' }}</td>
                  <td>
                    <a [routerLink]="['/admin/listings', item.listingId]" class="btn-outline btn-sm">Review</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .page-header { margin-bottom: $space-6; }
    .page-title { font-size: $text-2xl; font-weight: 800; }
    .page-subtitle { font-size: $text-sm; color: $text-muted; margin-top: $space-1; }

    .table-wrapper {
      background: $card-light;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: $space-3 $space-4;
        text-align: left;
        font-size: $text-sm;
        border-bottom: 1px solid $card-border;
        white-space: nowrap;
      }

      th {
        font-weight: 600;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: $text-xs;
        background: $bg-light;
      }

      tr:last-child td { border-bottom: none; }
      tr:hover td { background: $bg-light; }
    }

    .title-cell {
      font-weight: 600;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .text-muted { color: $text-muted; }

    .score {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-weight: 700;
      font-size: $text-xs;

      &.high { background: #f0fdf4; color: #16a34a; }
      &.medium { background: #fefce8; color: #ca8a04; }
      &.low { background: #fef2f2; color: #dc2626; }
    }
  `]
})
export class AdminListingsComponent implements OnInit {
  listings: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPendingListings().subscribe({
      next: (res: any) => { this.listings = res.data || res; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
