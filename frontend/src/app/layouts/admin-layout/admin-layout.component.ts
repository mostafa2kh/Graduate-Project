import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-dashboard">
      <aside class="admin-sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <a routerLink="/admin" class="logo">
            <span class="logo-icon">A</span>
            <span class="logo-text">Admin Panel</span>
          </a>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </a>
          <a routerLink="/admin/listings" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            Moderation
          </a>
          <a routerLink="/admin/users" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Users
          </a>
          <a routerLink="/admin/kyc" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            KYC Reviews
          </a>
          <a routerLink="/admin/audit" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Audit Logs
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="nav-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Back to Site
          </a>
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <button class="sidebar-toggle" (click)="sidebarOpen = !sidebarOpen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div class="topbar-right">
            <div class="admin-badge">Admin</div>
            <div class="avatar">A</div>
          </div>
        </header>

        <main class="dashboard-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .admin-dashboard {
      display: flex;
      min-height: 100vh;
    }

    .admin-sidebar {
      width: $sidebar-width;
      background: $bg-dark;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
      transition: transform $transition-base;

      @include sm {
        transform: translateX(-100%);
        &.open {
          transform: translateX(0);
        }
      }
    }

    .sidebar-header {
      padding: $space-6;
      border-bottom: 1px solid rgba($text-white, 0.08);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: $space-3;
      text-decoration: none;
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      background: $secondary;
      color: $text-dark;
      border-radius: 12px;
      font-weight: 950;
      font-size: $text-lg;
      letter-spacing: -0.04em;
    }

    .logo-text {
      font-size: $text-lg;
      font-weight: 950;
      color: $text-white;
      letter-spacing: -0.05em;
    }

    .sidebar-nav {
      flex: 1;
      padding: $space-4;
      display: flex;
      flex-direction: column;
      gap: $space-1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-3 $space-4;
      border-radius: 12px;
      font-size: $text-sm;
      font-weight: 500;
      color: rgba($text-white, 0.6);
      transition: all $transition-base;
      text-decoration: none;

      &:hover {
        background: rgba($text-white, 0.06);
        color: $text-white;
      }

      &.active {
        background: rgba($secondary, 0.1);
        color: $secondary;
        font-weight: 600;
      }
    }

    .icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      opacity: 0.7;

      .nav-item.active & {
        opacity: 1;
        color: $secondary;
      }
    }

    .sidebar-footer {
      padding: $space-4;
      border-top: 1px solid rgba($text-white, 0.08);
    }

    .main-area {
      flex: 1;
      margin-left: $sidebar-width;
      min-height: 100vh;
      background: $warm-white;

      @include sm {
        margin-left: 0;
      }
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: $navbar-height;
      padding: 0 $space-8;
      background: $card-light;
      border-bottom: 1px solid rgba(#13211f, 0.08);

      @include sm {
        padding: 0 $space-4;
      }
    }

    .sidebar-toggle {
      display: none;
      background: none;
      border: none;
      padding: $space-2;
      color: $text-muted-green;

      @include sm {
        display: flex;
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: $space-4;
    }

    .admin-badge {
      padding: $space-1 $space-3;
      background: rgba($secondary, 0.12);
      color: $secondary-dark;
      border-radius: $radius-full;
      font-size: $text-xs;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $bg-dark;
      color: $secondary;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: $text-sm;
      cursor: pointer;
    }

    .dashboard-content {
      padding: $space-8;

      @include sm {
        padding: $space-4;
      }
    }
  `]
})
export class AdminLayoutComponent {
  sidebarOpen = false;
}
