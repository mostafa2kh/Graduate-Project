import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="container not-found-content">
        <div class="not-found-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <h1 class="not-found-title">404</h1>
        <p class="not-found-subtitle">Page not found</p>
        <p class="not-found-desc">
          The page you are looking for does not exist or has been moved.
        </p>
        <a routerLink="/" class="btn-primary">Go Home</a>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - $navbar-height - 200px);
      padding: $space-16 0;
      text-align: center;
    }

    .not-found-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-4;
    }

    .not-found-icon {
      width: 80px;
      height: 80px;
      color: $text-light;
      margin-bottom: $space-4;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .not-found-title {
      font-size: 6rem;
      font-weight: 800;
      background: linear-gradient(135deg, $primary, $secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }

    .not-found-subtitle {
      font-size: $text-2xl;
      font-weight: 600;
      color: $text-dark;
    }

    .not-found-desc {
      font-size: $text-base;
      color: $text-muted;
      max-width: 400px;
      margin-bottom: $space-4;
    }
  `]
})
export class NotFoundComponent {}
