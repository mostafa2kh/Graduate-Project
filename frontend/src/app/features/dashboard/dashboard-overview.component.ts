import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ListingService } from '../../core/services/listing.service';
import { BookingService } from '../../core/services/booking.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="overview">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's your overview.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" routerLink="/dashboard/listings">
          <div class="stat-icon listings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.myListings }}</span>
            <span class="stat-label">My Listings</span>
          </div>
        </div>

        <div class="stat-card" routerLink="/dashboard/bookings">
          <div class="stat-icon bookings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.activeBookings }}</span>
            <span class="stat-label">Active Bookings</span>
          </div>
        </div>

        <div class="stat-card" routerLink="/dashboard/messages">
          <div class="stat-icon messages">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.unreadMessages }}</span>
            <span class="stat-label">Unread Messages</span>
          </div>
        </div>

        <div class="stat-card" routerLink="/dashboard/payments">
          <div class="stat-icon payments">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.pendingPayments }}</span>
            <span class="stat-label">Pending Payments</span>
          </div>
        </div>
      </div>

      <div class="sections-grid">
        <div class="section-card">
          <div class="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="actions-list">
            <a routerLink="/dashboard/listings/create" class="action-item">
              <span class="action-icon add">+</span>
              <span class="action-text">Create New Listing</span>
            </a>
            <a routerLink="/dashboard/bookings" class="action-item">
              <span class="action-icon view">&#8594;</span>
              <span class="action-text">View My Bookings</span>
            </a>
            <a routerLink="/dashboard/messages" class="action-item">
              <span class="action-icon chat">&#9993;</span>
              <span class="action-text">Check Messages</span>
            </a>
            <a routerLink="/verification" class="action-item">
              <span class="action-icon verify">&#10003;</span>
              <span class="action-text">Verify Identity (KYC)</span>
            </a>
            <a routerLink="/search" class="action-item">
              <span class="action-icon search">&#128269;</span>
              <span class="action-text">Browse Properties</span>
            </a>
          </div>
        </div>

        <div class="section-card">
          <div class="section-header">
            <h2>Recent Listings</h2>
          </div>
          @if (recentListings.length > 0) {
            <div class="listings-list">
              @for (listing of recentListings; track listing.id) {
                <a [routerLink]="['/dashboard/listings', listing.id]" class="listing-item">
                  <div class="listing-info">
                    <span class="listing-title">{{ listing.title }}</span>
                    <span class="listing-status" [class]="listing.status?.toLowerCase()">{{ listing.status }}</span>
                  </div>
                  <span class="listing-price">\${{ listing.price?.toLocaleString() }}</span>
                </a>
              }
            </div>
          } @else {
            <div class="empty-section">
              <p>No listings yet. <a routerLink="/dashboard/listings/create">Create your first listing</a></p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .page-header {
      margin-bottom: $space-8;
    }

    .page-title {
      font-size: $text-2xl;
      font-weight: 800;
      color: $text-dark;
      margin-bottom: $space-1;
    }

    .page-subtitle {
      color: $text-muted;
      font-size: $text-sm;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $space-4;
      margin-bottom: $space-8;

      @include lg { grid-template-columns: repeat(2, 1fr); }
      @include sm { grid-template-columns: 1fr; }
    }

    .stat-card {
      @include card;
      display: flex;
      align-items: center;
      gap: $space-4;
      padding: $space-5;
      cursor: pointer;
      transition: transform $transition-base, box-shadow $transition-base;

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-lg;
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: $radius-lg;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg { width: 24px; height: 24px; }

      &.listings { background: $primary-bg; color: $primary; }
      &.bookings { background: #F5F3FF; color: #7C3AED; }
      &.messages { background: #ECFEFF; color: #06B6D4; }
      &.payments { background: #F0FDF4; color: #22C55E; }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: $text-2xl;
      font-weight: 800;
      color: $text-dark;
      line-height: 1;
    }

    .stat-label {
      font-size: $text-xs;
      color: $text-muted;
      margin-top: $space-1;
    }

    .sections-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-6;

      @include lg { grid-template-columns: 1fr; }
    }

    .section-card {
      @include card;
      padding: $space-6;
    }

    .section-header {
      margin-bottom: $space-4;

      h2 {
        font-size: $text-base;
        font-weight: 700;
        color: $text-dark;
      }
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-3 $space-4;
      border-radius: $radius-md;
      transition: background $transition-base;
      text-decoration: none;
      color: $text-dark;

      &:hover {
        background: $bg-light;
      }
    }

    .action-icon {
      width: 32px;
      height: 32px;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $text-sm;
      font-weight: 700;
      flex-shrink: 0;

      &.add { background: $primary-bg; color: $primary; }
      &.view { background: #F5F3FF; color: #7C3AED; }
      &.chat { background: #ECFEFF; color: #06B6D4; }
      &.verify { background: #F0FDF4; color: #22C55E; }
      &.search { background: #FFFBEB; color: #F59E0B; }
    }

    .action-text {
      font-size: $text-sm;
      font-weight: 500;
    }

    .listings-list {
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }

    .listing-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $space-3 $space-4;
      border-radius: $radius-md;
      text-decoration: none;
      transition: background $transition-base;

      &:hover {
        background: $bg-light;
      }
    }

    .listing-info {
      display: flex;
      flex-direction: column;
      gap: $space-1;
    }

    .listing-title {
      font-size: $text-sm;
      font-weight: 600;
      color: $text-dark;
    }

    .listing-status {
      font-size: $text-xs;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 999px;
      width: fit-content;

      &.draft { background: $bg-gray; color: $text-muted; }
      &.pending_review { background: #FFFBEB; color: #F59E0B; }
      &.approved { background: #F0FDF4; color: #22C55E; }
    }

    .listing-price {
      font-size: $text-sm;
      font-weight: 700;
      color: $text-dark;
    }

    .empty-section {
      text-align: center;
      padding: $space-8;
      color: $text-muted;
      font-size: $text-sm;

      a {
        color: $primary;
        text-decoration: none;
        font-weight: 600;
      }
    }
  `]
})
export class DashboardOverviewComponent implements OnInit {
  stats = {
    myListings: 0,
    activeBookings: 0,
    unreadMessages: 0,
    pendingPayments: 0,
  };

  recentListings: any[] = [];

  constructor(
    private listingService: ListingService,
    private bookingService: BookingService,
    private chatService: ChatService,
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.listingService.getMyListings(0, 5).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats.myListings = res.data.totalElements ?? res.data.length ?? 0;
          this.recentListings = res.data.content ?? res.data ?? [];
        }
      }
    });

    this.chatService.getUnreadCount().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats.unreadMessages = res.data.count ?? res.data ?? 0;
        }
      }
    });
  }
}
