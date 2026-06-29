import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { ChatbotComponent } from '../../shared/components/chatbot/chatbot.component';
import { AuthService } from '../../core/services/auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationBellComponent, ChatbotComponent],
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
          <a routerLink="/dashboard/overview" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </a>
          @if (isLandlord) {
            <a routerLink="/dashboard/listings" class="nav-item" routerLinkActive="active">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              My Listings
            </a>
            <a routerLink="/dashboard/requests" class="nav-item" routerLinkActive="active">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Booking Requests
            </a>
          }
          @if (isRenter) {
            <a routerLink="/dashboard/bookings" class="nav-item" routerLinkActive="active">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Bookings
            </a>
            <a routerLink="/dashboard/favorites" class="nav-item" routerLinkActive="active">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Favorites
            </a>
            <a routerLink="/dashboard/payments" class="nav-item" routerLinkActive="active">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              Payments
            </a>
          }
          <a routerLink="/dashboard/messages" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Messages
          </a>
          <a routerLink="/dashboard/notifications" class="nav-item" routerLinkActive="active">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            Notifications
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
      <app-chatbot/>
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

    .avatar-wrapper {
      position: relative;
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
      text-transform: uppercase;
    }

    .profile-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 220px;
      background: $card-light;
      border-radius: 16px;
      border: 1px solid $card-border;
      box-shadow: 0 10px 40px rgba($text-dark, 0.18);
      z-index: 300;
      margin-top: $space-2;
      overflow: hidden;
    }

    .profile-header {
      padding: $space-4;
      border-bottom: 1px solid rgba(#13211f, 0.08);
      background: $warm-white;
    }

    .profile-name {
      display: block;
      font-weight: 900;
      font-size: $text-sm;
      color: $bg-dark-primary;
    }

    .profile-email {
      display: block;
      font-size: $text-xs;
      color: $text-muted-green;
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
      border-radius: 12px;
      font-size: $text-sm;
      font-weight: 700;
      color: $bg-dark-primary;
      text-decoration: none;
      cursor: pointer;
      transition: background $transition-base;

      &:hover {
        background: $warm-white;
      }

      svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        color: $text-muted-green;
      }

      &.logout {
        color: #dc2626;
        svg { color: #dc2626; }
      }
    }

    .profile-divider {
      height: 1px;
      background: rgba(#13211f, 0.08);
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
  isRenter = false;
  isLandlord = false;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser<{ fullName: string; email: string; roles?: string[] }>();
    if (user) {
      this.userName = user.fullName || '';
      this.userEmail = user.email || '';
      this.userInitials = this.getInitials(user.fullName);
      this.isRenter = user.roles?.includes('ROLE_RENTER') ?? false;
      this.isLandlord = user.roles?.includes('ROLE_LANDLORD') ?? false;
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
