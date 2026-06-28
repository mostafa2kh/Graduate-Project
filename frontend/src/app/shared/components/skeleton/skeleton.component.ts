import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-wrapper">
      @if (type === 'card') {
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-body">
            <div class="skeleton-line w-40"></div>
            <div class="skeleton-line w-80"></div>
            <div class="skeleton-line w-60"></div>
            <div class="skeleton-line w-30"></div>
          </div>
        </div>
      } @else if (type === 'table-row') {
        <div class="skeleton-table-row">
          @for (c of columns; track c) {
            <div class="skeleton-line" [style.width]="c"></div>
          }
        </div>
      } @else if (type === 'avatar') {
        <div class="skeleton-avatar">
          <div class="skeleton-circle"></div>
          <div class="skeleton-body">
            <div class="skeleton-line w-50"></div>
            <div class="skeleton-line w-30"></div>
          </div>
        </div>
      } @else {
        <div class="skeleton-text">
          @for (l of lines; track l) {
            <div class="skeleton-line" [style.width]="l"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .skeleton-wrapper {
      width: 100%;
    }

    .skeleton-line {
      height: 14px;
      border-radius: $radius-sm;
      background: linear-gradient(90deg, $bg-gray 25%, $card-border 50%, $bg-gray 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      margin-bottom: $space-3;

      &.w-30 { width: 30%; }
      &.w-40 { width: 40%; }
      &.w-50 { width: 50%; }
      &.w-60 { width: 60%; }
      &.w-80 { width: 80%; }
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .skeleton-card {
      background: $card-light;
      border-radius: $radius-xl;
      overflow: hidden;
      border: 1px solid $card-border;
    }

    .skeleton-image {
      height: 200px;
      background: linear-gradient(90deg, $bg-gray 25%, $card-border 50%, $bg-gray 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-body {
      padding: $space-4 $space-5 $space-5;
    }

    .skeleton-table-row {
      display: flex;
      gap: $space-4;
      padding: $space-4;
      border-bottom: 1px solid $card-border;
    }

    .skeleton-avatar {
      display: flex;
      align-items: center;
      gap: $space-4;
      padding: $space-4;
    }

    .skeleton-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(90deg, $bg-gray 25%, $card-border 50%, $bg-gray 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      flex-shrink: 0;
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'card' | 'table-row' | 'avatar' | 'text' = 'text';
  @Input() lines: string[] = ['100%', '80%', '60%'];
  @Input() columns: string[] = ['30%', '20%', '25%', '15%'];
}
