import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-chat-inbox',
  standalone: true,
  imports: [RouterLink, DatePipe, SlicePipe, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <div class="page-header"><h1 class="page-title">Messages</h1><p class="page-subtitle">Your conversations</p></div>

      @if (loading) { <app-skeleton type="table-row" /> }
      @else if (threads.length === 0) { <app-empty-state icon="message" title="No conversations" message="Start a conversation from a booking or listing." /> }
      @else {
        <div class="thread-list">
          @for (t of threads; track t.id) {
            <div class="thread-item" [class.unread]="t.unreadCount > 0" (click)="openThread(t.id)">
              <div class="thread-avatar">{{ t.otherParticipantId | slice:0:2 }}</div>
              <div class="thread-body">
                <div class="thread-top">
                  <span class="thread-name">User {{ t.otherParticipantId | slice:0:8 }}...</span>
                  <span class="thread-time">{{ t.lastMessageAt | date:'short' }}</span>
                </div>
                <p class="thread-preview">{{ t.lastMessagePreview || 'No messages yet' }}</p>
              </div>
              @if (t.unreadCount > 0) {
                <div class="unread-badge">{{ t.unreadCount }}</div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .page-header { margin-bottom: $space-6; }
    .page-title { font-size: $text-2xl; font-weight: 800; }
    .page-subtitle { font-size: $text-sm; color: $text-muted; margin-top: $space-1; }
    .thread-list { display: flex; flex-direction: column; gap: $space-2; }
    .thread-item { display: flex; align-items: center; gap: $space-4; padding: $space-4; background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; cursor: pointer; transition: all $transition-base; &:hover { background: $bg-light; } &.unread { border-left: 3px solid $primary; } }
    .thread-avatar { width: 44px; height: 44px; border-radius: 50%; background: $primary-bg; color: $primary; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: $text-sm; flex-shrink: 0; }
    .thread-body { flex: 1; min-width: 0; }
    .thread-top { display: flex; justify-content: space-between; margin-bottom: $space-1; }
    .thread-name { font-size: $text-sm; font-weight: 600; }
    .thread-time { font-size: $text-xs; color: $text-muted; }
    .thread-preview { font-size: $text-sm; color: $text-muted; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .unread-badge { background: $primary; color: white; font-size: $text-xs; font-weight: 700; min-width: 20px; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class ChatInboxComponent implements OnInit {
  threads: any[] = []; loading = true;

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    this.chatService.getMyThreads().subscribe({
      next: (res: any) => { this.threads = res.data || res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openThread(id: string): void { this.router.navigate(['/dashboard/messages', id]); }
}
