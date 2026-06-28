import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trust-score',
  standalone: true,
  template: `
    <div class="trust-score" [class]="'level-' + level">
      <div class="score-ring">
        <svg viewBox="0 0 120 120" class="score-svg">
          <circle cx="60" cy="60" r="54" class="score-bg" />
          <circle cx="60" cy="60" r="54" class="score-fill"
                  [attr.stroke-dasharray]="circumference"
                  [attr.stroke-dashoffset]="offset" />
        </svg>
        <div class="score-value">{{ score }}</div>
      </div>
      <div class="score-info">
        <h4 class="score-label">{{ label }}</h4>
        @if (subtitle) {
          <p class="score-subtitle">{{ subtitle }}</p>
        }
      </div>
      @if (flags && flags.length > 0) {
        <div class="score-flags">
          @for (flag of flags; track flag.id) {
            <div class="flag" [class]="'severity-' + (flag.severity || 'INFO').toLowerCase()">
              <span class="flag-icon">
                @if ((flag.severity || 'INFO') === 'CRITICAL') { &#9888; }
                @else if ((flag.severity || 'INFO') === 'WARNING') { &#9888; }
                @else { &#9432; }
              </span>
              <span class="flag-text">{{ flag.description }}</span>
            </div>
          }
        </div>
      }
      <p class="mock-notice">AI review is simulated for demonstration</p>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .trust-score {
      background: $card-light;
      border: 1px solid $card-border;
      border-radius: $radius-lg;
      padding: $space-6;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-4;

      &.level-high { border-color: #22c55e; }
      &.level-medium { border-color: #eab308; }
      &.level-low { border-color: #ef4444; }
    }

    .score-ring {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .score-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .score-bg {
      fill: none;
      stroke: $bg-gray;
      stroke-width: 8;
    }

    .score-fill {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.8s ease;

      .level-high & { stroke: #22c55e; }
      .level-medium & { stroke: #eab308; }
      .level-low & { stroke: #ef4444; }
    }

    .score-value {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $text-2xl;
      font-weight: 800;
      color: $text-dark;
    }

    .score-info {
      text-align: center;
    }

    .score-label {
      font-size: $text-lg;
      font-weight: 700;
      color: $text-dark;
    }

    .score-subtitle {
      font-size: $text-sm;
      color: $text-muted;
      margin-top: $space-1;
    }

    .score-flags {
      display: flex;
      flex-direction: column;
      gap: $space-2;
      width: 100%;
    }

    .flag {
      display: flex;
      align-items: flex-start;
      gap: $space-2;
      padding: $space-2 $space-3;
      border-radius: $radius-md;
      font-size: $text-xs;

      &.severity-critical {
        background: #fef2f2;
        color: #991b1b;
      }

      &.severity-warning {
        background: #fefce8;
        color: #854d0e;
      }

      &.severity-info {
        background: $primary-bg;
        color: $primary;
      }
    }

    .flag-icon {
      flex-shrink: 0;
      font-size: $text-sm;
      margin-top: 1px;
    }

    .flag-text {
      line-height: 1.4;
    }

    .mock-notice {
      font-size: 10px;
      color: $text-light;
      font-style: italic;
      text-align: center;
    }
  `]
})
export class TrustScoreComponent {
  @Input() score = 0;
  @Input() subtitle = '';
  @Input() flags: { id: string; flagType: string; severity: string; description: string }[] = [];

  protected readonly circumference = 339.292;

  get offset(): number {
    return this.circumference - (this.score / 100) * this.circumference;
  }

  get level(): string {
    if (this.score >= 70) return 'high';
    if (this.score >= 40) return 'medium';
    return 'low';
  }

  get label(): string {
    if (this.score >= 80) return 'High Trust';
    if (this.score >= 60) return 'Moderate Trust';
    if (this.score >= 40) return 'Low Trust';
    return 'Very Low Trust';
  }
}
