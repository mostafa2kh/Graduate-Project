import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { AuthService } from '../../core/services/auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationBellComponent],
  template: `
    <div class="dashboard">
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <a routerLink="/" class="logo">
            <span class="logo-icon">R</span>
            <span class="logo-text">RentSphere</span>
          </a>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </a>
          <a routerLink="/dashboard/listings" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            My Listings
          </a>
          <a routerLink="/dashboard/bookings" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Bookings
          </a>
          <a routerLink="/dashboard/messages" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Messages
          </a>
          <a routerLink="/dashboard/profile" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Profile
          </a>
        </nav>

        <div class="sidebar-footer">
          <a (click)="logout()" class="nav-item" style="cursor:pointer">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
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
            <app-notification-bell />
            <div class="avatar-wrapper">
              <div class="avatar" (click)="toggleProfile()">{{ userInitials }}</div>
              @if (profileOpen) {
                <div class="profile-dropdown" (click)="$event.stopPropagation()">
                  <div class="profile-header">
                    <span class="profile-name">{{ userName }}</span>
                    <span class="profile-email">{{ userEmail }}</span>
                  </div>
                  <div class="profile-menu">
                    <a routerLink="/dashboard/profile" class="profile-item" (click)="profileOpen = false">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Profile
                    </a>
                    <a routerLink="/dashboard/settings" class="profile-item" (click)="profileOpen = false">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                      Settings
                    </a>
                    <div class="profile-divider"></div>
                    <a class="profile-item logout" (click)="logout()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </a>
                  </div>
                </div>
              }
            </div>
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

    .dashboard {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: $sidebar-width;
      background: $card-light;
      border-right: 1px solid $card-border;
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
      border-bottom: 1px solid $card-border;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: $space-2;
      text-decoration: none;
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, $primary, $secondary);
      color: $text-white;
      border-radius: $radius-md;
      font-weight: 800;
      font-size: $text-base;
    }

    .logo-text {
      font-size: $text-lg;
      font-weight: 800;
      background: linear-gradient(135deg, $primary, $secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
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
      border-radius: $radius-md;
      font-size: $text-sm;
      font-weight: 500;
      color: $text-muted;
      transition: all $transition-base;
      text-decoration: none;

      &:hover {
        background: $bg-light;
        color: $text-dark;
      }

      &.active {
        background: $primary-bg;
        color: $primary;
        font-weight: 600;
      }
    }

    .icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .sidebar-footer {
      padding: $space-4;
      border-top: 1px solid $card-border;
    }

    .main-area {
      flex: 1;
      margin-left: $sidebar-width;
      min-height: 100vh;
      background: $bg-light;

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
      border-bottom: 1px solid $card-border;

      @include sm {
        padding: 0 $space-4;
      }
    }

    .sidebar-toggle {
      display: none;
      background: none;
      border: none;
      padding: $space-2;
      color: $text-muted;

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

    .avatar-wrapper {
      position: relative;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, $primary, $secondary);
      color: $text-white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: $text-sm;
      cursor: pointer;
      text-transform: uppercase;
    }

    .profile-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 220px;
      background: $card-light;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      box-shadow: 0 10px 40px rgba(0,0,0,0.12);
      z-index: 300;
      margin-top: $space-2;
      overflow: hidden;
    }

    .profile-header {
      padding: $space-4;
      border-bottom: 1px solid $card-border;
      background: $bg-light;
    }

    .profile-name {
      display: block;
      font-weight: 700;
      font-size: $text-sm;
      color: $text-dark;
    }

    .profile-email {
      display: block;
      font-size: $text-xs;
      color: $text-muted;
      margin-top: 2px;
    }

    .profile-menu {
      padding: $space-2;
    }

    .profile-item {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-3;
      border-radius: $radius-md;
      font-size: $text-sm;
      color: $text-dark;
      text-decoration: none;
      cursor: pointer;
      transition: background $transition-base;

      &:hover {
        background: $bg-light;
      }

      svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        color: $text-muted;
      }

      &.logout {
        color: #ef4444;
        svg { color: #ef4444; }
      }
    }

    .profile-divider {
      height: 1px;
      background: $card-border;
      margin: $space-1 $space-2;
    }

    .dashboard-content {
      padding: $space-8;

      @include sm {
        padding: $space-4;
      }
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  sidebarOpen = false;
  profileOpen = false;
  userInitials = 'U';
  userName = '';
  userEmail = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser<{ fullName: string; email: string }>();
    if (user) {
      this.userName = user.fullName || '';
      this.userEmail = user.email || '';
      this.userInitials = this.getInitials(user.fullName);
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleProfile(): void { this.profileOpen = !this.profileOpen; }

  @HostListener('document:click') closeProfile(): void { this.profileOpen = false; }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
