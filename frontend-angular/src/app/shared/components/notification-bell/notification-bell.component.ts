import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="notif-wrapper">
      <div class="bell-container" (click)="toggleDropdown()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        @if (unreadCount > 0) {
          <span class="badge-count">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
        }
      </div>

      @if (open) {
        <div class="dropdown" (click)="$event.stopPropagation()">
          <div class="dropdown-header">
            <h3>Notifications</h3>
            <button class="btn-ghost btn-sm" (click)="markAllRead()">Mark all read</button>
          </div>
          <div class="dropdown-body">
            @if (notifications.length === 0) {
              <div class="empty-state">No notifications</div>
            } @else {
              @for (n of notifications.slice(0, 10); track n.id) {
                <div class="notif-item" [class.unread]="!n.read" (click)="read(n)">
                  <div class="notif-dot" [class.read]="n.read"></div>
                  <div class="notif-content">
                    <strong>{{ n.title }}</strong>
                    <p>{{ n.body }}</p>
                    <span class="notif-time">{{ n.createdAt | date:'short' }}</span>
                  </div>
                </div>
              }
            }
          </div>
          <div class="dropdown-footer">
            <a routerLink="/dashboard/notifications">View all notifications</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .notif-wrapper { position: relative; display: inline-block; }
    .bell-container { cursor: pointer; padding: 4px; svg { width: 22px; height: 22px; color: #64748b; } }
    .badge-count { position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; font-size: 10px; font-weight: 700; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
    .dropdown { position: absolute; top: 100%; right: 0; width: 360px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 300; margin-top: 8px; }
    .dropdown-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; h3 { font-size: 14px; font-weight: 700; margin: 0; } }
    .dropdown-body { max-height: 360px; overflow-y: auto; }
    .empty-state { text-align: center; padding: 32px; color: #94a3b8; font-size: 13px; }
    .notif-item { display: flex; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; &:hover { background: #f8fafc; } &.unread { background: #eff6ff; &:hover { background: #dbeafe; } } }
    .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; margin-top: 6px; flex-shrink: 0; &.read { background: #cbd5e1; } }
    .notif-content { flex: 1; min-width: 0; strong { display: block; font-size: 13px; margin-bottom: 2px; } p { font-size: 12px; color: #64748b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } }
    .notif-time { font-size: 11px; color: #94a3b8; display: block; margin-top: 4px; }
    .dropdown-footer { padding: 10px 16px; border-top: 1px solid #e2e8f0; text-align: center; a { font-size: 13px; color: #2563eb; text-decoration: none; &:hover { text-decoration: underline; } } }
  `]
})
export class NotificationBellComponent implements OnInit {
  open = false;
  unreadCount = 0;
  notifications: any[] = [];

  constructor(private notificationService: NotificationService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res: any) => { const d = res.data || res; this.unreadCount = d.count || 0; }
    });
    this.notificationService.getNotifications(0, 20).subscribe({
      next: (res: any) => { const d = res.data || res; this.notifications = d.content || d.items || d; }
    });
  }

  toggleDropdown(): void { this.open = !this.open; if (this.open) this.load(); }

  @HostListener('document:click') close(): void { this.open = false; }

  read(n: any): void {
    if (!n.read) {
      this.notificationService.markAsRead(n.id).subscribe();
      n.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => { this.notifications.forEach(n => n.read = true); this.unreadCount = 0; this.toast.show('All marked as read', 'success'); }
    });
  }
}
