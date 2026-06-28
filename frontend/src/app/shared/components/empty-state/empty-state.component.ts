import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        @if (icon === 'heart') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        } @else if (icon === 'search') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        } @else if (icon === 'folder') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        } @else if (icon === 'message') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        } @else {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        }
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      @if (message) {
        <p class="empty-message">{{ message }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: $space-12 $space-4;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      color: $text-light;
      margin-bottom: $space-4;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .empty-title {
      font-size: $text-lg;
      font-weight: 700;
      color: $text-dark;
      margin-bottom: $space-2;
    }

    .empty-message {
      font-size: $text-sm;
      color: $text-muted;
      max-width: 360px;
      line-height: 1.6;
      margin-bottom: $space-6;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = '';
  @Input() icon: 'heart' | 'search' | 'folder' | 'message' | 'default' = 'default';
}
