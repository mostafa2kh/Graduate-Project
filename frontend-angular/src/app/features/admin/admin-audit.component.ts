import { Component, OnInit } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../core/services/audit.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [DatePipe, SlicePipe, FormsModule, SkeletonComponent, EmptyStateComponent, BadgeComponent, ModalComponent],
  template: `
    <div class="admin-audit">
      <div class="page-header">
        <h1 class="page-title">Audit Log</h1>
        <p class="page-subtitle">Security and administrative event tracking</p>
      </div>

      <div class="filters-card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Event Type</label>
            <select [(ngModel)]="filters.eventType" (change)="applyFilters()">
              <option value="">All Types</option>
              <option value="ADMIN_ACTION">Admin Action</option>
              <option value="KYC_ACTION">KYC Action</option>
              <option value="LISTING_ACTION">Listing Action</option>
              <option value="BOOKING_ACTION">Booking Action</option>
              <option value="PAYMENT_ACTION">Payment Action</option>
              <option value="SYSTEM_EVENT">System Event</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Action</label>
            <select [(ngModel)]="filters.action" (change)="applyFilters()">
              <option value="">All Actions</option>
              <option value="LISTING_APPROVED">Listing Approved</option>
              <option value="LISTING_REJECTED">Listing Rejected</option>
              <option value="KYC_APPROVED">KYC Approved</option>
              <option value="KYC_REJECTED">KYC Rejected</option>
              <option value="BOOKING_CREATED">Booking Created</option>
              <option value="BOOKING_ACCEPTED">Booking Accepted</option>
              <option value="BOOKING_REJECTED">Booking Rejected</option>
              <option value="BOOKING_CANCELLED">Booking Cancelled</option>
              <option value="PAYMENT_COMPLETED">Payment Completed</option>
              <option value="PAYMENT_REFUNDED">Payment Refunded</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Target</label>
            <select [(ngModel)]="filters.targetType" (change)="applyFilters()">
              <option value="">All Targets</option>
              <option value="listing">Listing</option>
              <option value="user">User</option>
              <option value="kyc_submission">KYC Submission</option>
              <option value="booking">Booking</option>
              <option value="payment">Payment</option>
            </select>
          </div>
          <div class="filter-group">
            <label>From</label>
            <input type="datetime-local" [(ngModel)]="filters.dateFrom" (change)="applyFilters()" />
          </div>
          <div class="filter-group">
            <label>To</label>
            <input type="datetime-local" [(ngModel)]="filters.dateTo" (change)="applyFilters()" />
          </div>
          <div class="filter-group filter-actions">
            <button class="btn-outline btn-sm" (click)="clearFilters()">Clear</button>
          </div>
        </div>
      </div>

      @if (loading) {
        <app-skeleton type="table-row" />
      } @else if (events.length === 0) {
        <app-empty-state icon="default" title="No Audit Events" message="No events match your filters." />
      } @else {
        <div class="table-wrapper">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (event of events; track event.id) {
                <tr>
                  <td class="text-muted">{{ event.createdAt | date:'medium' }}</td>
                  <td><app-badge [variant]="badgeVariant(event.eventType)">{{ event.eventType }}</app-badge></td>
                  <td>{{ event.actorId ? (event.actorId | slice:0:8) + '...' : 'SYSTEM' }}
                    @if (event.actorRole) { <span class="role-tag">{{ event.actorRole }}</span> }
                  </td>
                  <td class="action-cell">{{ event.action }}</td>
                  <td class="text-muted">{{ event.targetType ? event.targetType + ' / ' + (event.targetId | slice:0:8) : '-' }}</td>
                  <td class="text-muted">{{ event.source }}</td>
                  <td><button class="btn-outline btn-sm" (click)="openDetail(event)">Details</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button class="btn-outline btn-sm" [disabled]="page === 0" (click)="goToPage(page - 1)">Previous</button>
          <span class="page-info">Page {{ page + 1 }} of {{ totalPages }}</span>
          <button class="btn-outline btn-sm" [disabled]="page >= totalPages - 1" (click)="goToPage(page + 1)">Next</button>
        </div>
      }
    </div>

    <app-modal [open]="detailOpen" title="Audit Event Details" size="lg" [showFooter]="false" (close)="detailOpen = false">
      @if (selectedEvent) {
        <div class="detail-grid">
          <div class="detail-field"><span class="field-label">Event ID</span><span class="field-value mono">{{ selectedEvent.id }}</span></div>
          <div class="detail-field"><span class="field-label">Event Type</span><span class="field-value"><app-badge [variant]="badgeVariant(selectedEvent.eventType)">{{ selectedEvent.eventType }}</app-badge></span></div>
          <div class="detail-field"><span class="field-label">Timestamp</span><span class="field-value">{{ selectedEvent.createdAt | date:'medium' }}</span></div>
          <div class="detail-field"><span class="field-label">Actor ID</span><span class="field-value mono">{{ selectedEvent.actorId || 'SYSTEM' }}</span></div>
          <div class="detail-field"><span class="field-label">Actor Role</span><span class="field-value">{{ selectedEvent.actorRole || '-' }}</span></div>
          <div class="detail-field"><span class="field-label">Action</span><span class="field-value">{{ selectedEvent.action }}</span></div>
          <div class="detail-field"><span class="field-label">Target Type</span><span class="field-value">{{ selectedEvent.targetType || '-' }}</span></div>
          <div class="detail-field"><span class="field-label">Target ID</span><span class="field-value mono">{{ selectedEvent.targetId || '-' }}</span></div>
          <div class="detail-field"><span class="field-label">Source</span><span class="field-value">{{ selectedEvent.source }}</span></div>
          <div class="detail-field"><span class="field-label">IP Address</span><span class="field-value mono">{{ selectedEvent.ipAddress || '-' }}</span></div>
          <div class="detail-field"><span class="field-label">User Agent</span><span class="field-value" style="word-break:break-all;">{{ selectedEvent.userAgent || '-' }}</span></div>
          @if (selectedEvent.details) {
            <div class="detail-field full-width"><span class="field-label">Details</span><pre class="details-pre">{{ selectedEvent.details }}</pre></div>
          }
        </div>
      }
    </app-modal>
  `,
  styles: [`
    @use 'index' as *;

    .page-header { margin-bottom: $space-6; }
    .page-title { font-size: $text-2xl; font-weight: 800; }
    .page-subtitle { font-size: $text-sm; color: $text-muted; margin-top: $space-1; }

    .filters-card {
      background: $card-light;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      padding: $space-4 $space-5;
      margin-bottom: $space-5;
    }

    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: $space-3;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 140px;

      label {
        font-size: $text-xs;
        font-weight: 600;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      select, input {
        padding: $space-2 $space-3;
        border-radius: $radius-md;
        border: 1px solid $card-border;
        font-size: $text-sm;
        background: $bg-light;
        color: $text-dark;
        transition: border-color $transition-base;

        &:focus { outline: none; border-color: $primary; }
      }
    }

    .filter-actions {
      justify-content: flex-end;
      min-width: auto;
    }

    .table-wrapper {
      background: $card-light;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      overflow-x: auto;
    }

    .audit-table {
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

    .text-muted { color: $text-muted; }
    .action-cell { font-weight: 600; }

    .role-tag {
      display: inline-block;
      font-size: $text-xs;
      padding: 1px 6px;
      border-radius: $radius-sm;
      background: $primary-bg;
      color: $primary;
      margin-left: $space-1;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $space-4;
      margin-top: $space-5;
    }

    .page-info {
      font-size: $text-sm;
      color: $text-muted;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-4;
    }

    .detail-field {
      display: flex;
      flex-direction: column;
      gap: 2px;

      &.full-width { grid-column: 1 / -1; }
    }

    .field-label {
      font-size: $text-xs;
      font-weight: 600;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .field-value {
      font-size: $text-sm;
      color: $text-dark;
    }

    .mono { font-family: 'SF Mono', 'Cascadia Code', monospace; font-size: $text-xs; }

    .details-pre {
      background: $bg-light;
      border-radius: $radius-md;
      padding: $space-3;
      font-size: $text-xs;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
      margin: 0;
    }
  `]
})
export class AdminAuditComponent implements OnInit {
  events: any[] = [];
  loading = true;
  page = 0;
  size = 20;
  totalPages = 0;

  detailOpen = false;
  selectedEvent: any = null;

  filters: { eventType: string; action: string; targetType: string; dateFrom: string; dateTo: string } = {
    eventType: '', action: '', targetType: '', dateFrom: '', dateTo: ''
  };

  constructor(private auditService: AuditService) {}

  ngOnInit(): void { this.loadEvents(); }

  loadEvents(): void {
    this.loading = true;
    this.auditService.listEvents({
      eventType: this.filters.eventType || undefined,
      action: this.filters.action || undefined,
      targetType: this.filters.targetType || undefined,
      dateFrom: this.filters.dateFrom ? new Date(this.filters.dateFrom).toISOString() : undefined,
      dateTo: this.filters.dateTo ? new Date(this.filters.dateTo).toISOString() : undefined,
      page: this.page, size: this.size
    }).subscribe({
      next: (res: any) => {
        const d = res.data || res;
        this.events = d.events || d.content || [];
        this.page = d.page || d.number || 0;
        this.totalPages = d.totalPages || 0;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters(): void { this.page = 0; this.loadEvents(); }
  clearFilters(): void { this.filters = { eventType: '', action: '', targetType: '', dateFrom: '', dateTo: '' }; this.page = 0; this.loadEvents(); }
  goToPage(p: number): void { if (p >= 0 && p < this.totalPages) { this.page = p; this.loadEvents(); } }

  openDetail(event: any): void { this.selectedEvent = event; this.detailOpen = true; }

  badgeVariant(type: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
    if (type?.includes('APPROVED') || type?.includes('COMPLETED')) return 'success';
    if (type?.includes('REJECTED') || type?.includes('CANCELLED')) return 'danger';
    if (type?.includes('PENDING') || type?.includes('CREATED')) return 'warning';
    return 'primary';
  }
}
