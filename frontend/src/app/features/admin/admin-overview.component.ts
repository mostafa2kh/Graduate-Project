import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { AuditService } from '../../core/services/audit.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="admin-overview">
      <div class="page-header">
        <h1 class="page-title">Admin Dashboard</h1>
        <p class="page-subtitle">Platform overview and quick actions</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card pending" routerLink="/admin/listings">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.pendingReviews }}</span>
            <span class="stat-label">Pending Reviews</span>
          </div>
        </div>

        <div class="stat-card approved">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.approvedListings }}</span>
            <span class="stat-label">Approved</span>
          </div>
        </div>

        <div class="stat-card rejected">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.rejectedListings }}</span>
            <span class="stat-label">Rejected</span>
          </div>
        </div>

        <div class="stat-card users">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">Total Users</span>
          </div>
        </div>
      </div>

      <div class="page-header" style="margin-top: 2rem;">
        <h2 class="page-title" style="font-size: 1.25rem;">Quick Actions</h2>
      </div>

      <div class="quick-actions">
        <a routerLink="/admin/listings" class="action-card">
          <span class="action-icon">&#9881;</span>
          <span class="action-text">Review Pending Listings</span>
        </a>
        <a routerLink="/admin/users" class="action-card">
          <span class="action-icon">&#128101;</span>
          <span class="action-text">Manage Users</span>
        </a>
        <a routerLink="/admin/kyc" class="action-card">
          <span class="action-icon">&#128221;</span>
          <span class="action-text">KYC Reviews</span>
        </a>
        <a routerLink="/admin/audit" class="action-card">
          <span class="action-icon">&#128214;</span>
          <span class="action-text">Audit Log</span>
        </a>
      </div>

      <div class="page-header" style="margin-top: 2rem;">
        <h2 class="page-title" style="font-size: 1.25rem;">Recent Activity</h2>
      </div>

      @if (recentLoading) {
        <div class="recent-placeholder">Loading...</div>
      } @else if (recentEvents.length === 0) {
        <div class="recent-placeholder">No recent activity</div>
      } @else {
        <div class="recent-list">
          @for (e of recentEvents; track e.id) {
            <div class="recent-item">
              <div class="recent-dot" [class.dot-success]="e.action?.includes('APPROVED')||e.action?.includes('COMPLETED')"
                   [class.dot-danger]="e.action?.includes('REJECTED')||e.action?.includes('CANCELLED')"
                   [class.dot-warning]="e.action?.includes('CREATED')||e.action?.includes('PENDING')"></div>
              <div class="recent-content">
                <span class="recent-action">{{ e.action }}</span>
                <span class="recent-target">{{ e.targetSummary }}</span>
              </div>
              <span class="recent-time">{{ e.createdAt | date:'shortTime' }}</span>
            </div>
          }
        </div>
        <a routerLink="/admin/audit" class="view-all-link">View all audit events &rarr;</a>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .page-header {
      margin-bottom: $space-6;
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: $space-4;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: $space-4;
      padding: $space-6;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      background: $card-light;
      cursor: pointer;
      transition: all $transition-base;
      text-decoration: none;
      color: inherit;

      &:hover { transform: translateY(-2px); box-shadow: $shadow-md; }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg { width: 24px; height: 24px; }
    }

    .pending .stat-icon { background: #fefce8; color: #ca8a04; }
    .approved .stat-icon { background: #f0fdf4; color: #16a34a; }
    .rejected .stat-icon { background: #fef2f2; color: #dc2626; }
    .users .stat-icon { background: $primary-bg; color: $primary; }

    .stat-info {
      display: flex;
      flex-direction: column;

      .stat-value {
        font-size: $text-2xl;
        font-weight: 800;
      }

      .stat-label {
        font-size: $text-xs;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 2px;
      }
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $space-4;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-5;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      background: $card-light;
      text-decoration: none;
      color: inherit;
      transition: all $transition-base;

      &:hover { border-color: $primary; box-shadow: $shadow-md; }
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-size: $text-sm;
      font-weight: 600;
    }

    .recent-placeholder {
      text-align: center;
      padding: $space-8;
      color: $text-muted;
      font-size: $text-sm;
      background: $card-light;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
    }

    .recent-list {
      background: $card-light;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      overflow: hidden;
    }

    .recent-item {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-3 $space-4;
      border-bottom: 1px solid $card-border;
      transition: background $transition-base;

      &:last-child { border-bottom: none; }
      &:hover { background: $bg-light; }
    }

    .recent-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      background: $text-muted;

      &.dot-success { background: #16a34a; }
      &.dot-danger { background: #dc2626; }
      &.dot-warning { background: #ca8a04; }
    }

    .recent-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .recent-action {
      font-size: $text-sm;
      font-weight: 600;
    }

    .recent-target {
      font-size: $text-xs;
      color: $text-muted;
    }

    .recent-time {
      font-size: $text-xs;
      color: $text-muted;
      white-space: nowrap;
    }

    .view-all-link {
      display: block;
      text-align: center;
      padding: $space-3;
      font-size: $text-sm;
      font-weight: 600;
      color: $primary;
      text-decoration: none;
      margin-top: $space-2;

      &:hover { text-decoration: underline; }
    }
  `]
})
export class AdminOverviewComponent implements OnInit {
  stats: any = { pendingReviews: 0, approvedListings: 0, rejectedListings: 0, totalUsers: 0 };
  recentEvents: any[] = [];
  recentLoading = true;

  constructor(private adminService: AdminService, private auditService: AuditService) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (res: any) => { this.stats = res.data || res; },
      error: () => {}
    });
    this.auditService.getRecentActivity().subscribe({
      next: (res: any) => { this.recentEvents = res.data || res; this.recentLoading = false; },
      error: () => this.recentLoading = false
    });
  }
}
