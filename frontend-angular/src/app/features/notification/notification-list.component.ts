import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [RouterLink, DatePipe, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Notifications</h1>
        <button class="btn-outline btn-sm" (click)="markAllRead()">Mark All as Read</button>
      </div>

      @if (loading) { <app-skeleton type="table-row" /> }
      @else if (notifications.length === 0) { <app-empty-state icon="default" title="No notifications" message="You're all caught up!" /> }
      @else {
        <div class="notif-list">
          @for (n of notifications; track n.id) {
            <div class="notif-card" [class.unread]="!n.read" (click)="read(n)">
              <div class="notif-icon" [class]="n.type?.toLowerCase()">
                @switch (n.type) {
                  @case ('BOOKING') { <span>B</span> }
                  @case ('PAYMENT') { <span>P</span> }
                  @case ('MESSAGE') { <span>M</span> }
                  @case ('LISTING') { <span>L</span> }
                  @case ('KYC') { <span>K</span> }
                  @default { <span>N</span> }
                }
              </div>
              <div class="notif-body">
                <div class="notif-top">
                  <strong>{{ n.title }}</strong>
                  @if (!n.read) { <span class="unread-dot"></span> }
                </div>
                <p>{{ n.body }}</p>
                <span class="notif-time">{{ n.createdAt | date:'medium' }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: $space-6; }
    .page-title { font-size: $text-2xl; font-weight: 800; }
    .notif-list { display: flex; flex-direction: column; gap: $space-3; }
    .notif-card { display: flex; gap: $space-4; padding: $space-4; background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; cursor: pointer; transition: all $transition-base; &:hover { background: $bg-light; } &.unread { border-left: 3px solid $primary; background: #eff6ff; } }
    .notif-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: $text-sm; flex-shrink: 0; background: $primary-bg; color: $primary; &.payment { background: #dbeafe; color: #2563eb; } &.message { background: #f3e8ff; color: #9333ea; } &.listing { background: #d1fae5; color: #059669; } &.kyc { background: #fef3c7; color: #d97706; } }
    .notif-body { flex: 1; min-width: 0; }
    .notif-top { display: flex; align-items: center; gap: $space-2; margin-bottom: $space-1; strong { font-size: $text-sm; } }
    .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: $primary; flex-shrink: 0; }
    p { font-size: $text-sm; color: $text-muted; margin: 0 0 $space-2; }
    .notif-time { font-size: $text-xs; color: $text-muted; }
  `]
})
export class NotificationListComponent implements OnInit {
  notifications: any[] = []; loading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res: any) => { const d = res.data || res; this.notifications = d.content || d.items || d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  read(n: any): void {
    if (!n.read) { this.notificationService.markAsRead(n.id).subscribe(); n.read = true; }
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe({ next: () => { this.notifications.forEach(n => n.read = true); } });
  }
}
