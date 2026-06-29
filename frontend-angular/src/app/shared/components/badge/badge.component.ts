import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="variant">
      @if (icon) {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="badge-icon">
          @switch (icon) {
            @case ('check') { <polyline points="20 6 9 17 4 12"/> }
            @case ('x') { <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/> }
            @case ('alert') { <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/> }
            @case ('clock') { <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/> }
          }
        </svg>
      }
      <ng-content />
    </span>
  `,
  styles: [`
    @use 'index' as *;

    .badge {
      display: inline-flex;
      align-items: center;
      gap: $space-1;
      padding: $space-1 $space-3;
      border-radius: $radius-full;
      font-size: $text-xs;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .badge-icon {
      width: 14px;
      height: 14px;
    }

    .primary { background: $primary-bg; color: $primary; }
    .success { background: $success-bg; color: $success; }
    .warning { background: $warning-bg; color: $warning; }
    .danger { background: $danger-bg; color: $danger; }
    .neutral { background: $bg-gray; color: $text-muted; }
  `]
})
export class BadgeComponent {
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' = 'primary';
  @Input() icon?: 'check' | 'x' | 'alert' | 'clock';
}
