import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  template: `
    <header class="navbar">
      <div class="container navbar-content">
        <a routerLink="/" class="logo">
          <span class="logo-icon">R</span>
          <span class="logo-text">RentSphere</span>
        </a>

        <nav class="nav-links">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/listings" class="nav-link">Listings</a>

          @if (isLoggedIn) {
            <a routerLink="/profile" class="nav-link">{{ userName }}</a>
            <button class="btn-outline btn-sm" (click)="onLogout()">Logout</button>
          } @else {
            <a routerLink="/login" class="nav-link">Sign In</a>
            <a routerLink="/register" class="btn-primary btn-sm">Get Started</a>
          }
        </nav>

        <button class="mobile-menu-btn" (click)="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
          <span class="hamburger" [class.open]="mobileMenuOpen">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>

      @if (mobileMenuOpen) {
        <div class="mobile-menu">
          <a routerLink="/" class="mobile-link" (click)="mobileMenuOpen = false">Home</a>
          <a routerLink="/listings" class="mobile-link" (click)="mobileMenuOpen = false">Listings</a>
          @if (isLoggedIn) {
            <a routerLink="/profile" class="mobile-link" (click)="mobileMenuOpen = false">Profile</a>
            <a routerLink="/settings" class="mobile-link" (click)="mobileMenuOpen = false">Settings</a>
            <button class="btn-primary mobile-cta" (click)="onLogout(); mobileMenuOpen = false">Logout</button>
          } @else {
            <a routerLink="/login" class="mobile-link" (click)="mobileMenuOpen = false">Sign In</a>
            <a routerLink="/register" class="btn-primary mobile-cta" (click)="mobileMenuOpen = false">Get Started</a>
          }
        </div>
      }
    </header>

    <app-toast-container />

    <main class="main-content">
      <router-outlet />
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <div class="logo">
            <span class="logo-icon">R</span>
            <span class="logo-text">RentSphere</span>
          </div>
          <p class="footer-desc">
            Find your perfect rental property. RentSphere connects renters with trusted landlords.
          </p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h6>Platform</h6>
            <a href="#">Browse Listings</a>
            <a href="#">How It Works</a>
            <a href="#">Safety Tips</a>
          </div>
          <div class="footer-col">
            <h6>Company</h6>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div class="footer-col">
            <h6>Support</h6>
            <a href="#">Help Center</a>
            <a href="#">FAQ</a>
            <a href="#">Report Issue</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2026 RentSphere. All rights reserved. Built for Menoufia University.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @use 'index' as *;

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: $navbar-height;
      background: rgba($card-light, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid $card-border;
      z-index: 1000;
    }

    .navbar-content {
      @include flex-between;
      height: 100%;
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
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, $primary, $secondary);
      color: $text-white;
      border-radius: $radius-md;
      font-weight: 800;
      font-size: $text-lg;
    }

    .logo-text {
      font-size: $text-xl;
      font-weight: 800;
      background: linear-gradient(135deg, $primary, $secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: $space-6;

      @include sm {
        display: none;
      }
    }

    .nav-link {
      font-size: $text-sm;
      font-weight: 500;
      color: $text-muted;
      transition: color $transition-base;
      padding: $space-2 0;

      &:hover, &.active {
        color: $primary;
      }
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      padding: $space-2;

      @include sm {
        display: flex;
      }
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 4px;

      span {
        display: block;
        width: 24px;
        height: 2px;
        background: $text-dark;
        border-radius: 2px;
        transition: all $transition-base;
      }

      &.open span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      &.open span:nth-child(2) {
        opacity: 0;
      }
      &.open span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
      }
    }

    .mobile-menu {
      position: absolute;
      top: $navbar-height;
      left: 0;
      right: 0;
      background: $card-light;
      border-bottom: 1px solid $card-border;
      padding: $space-4;
      display: flex;
      flex-direction: column;
      gap: $space-3;
      animation: slideDown 200ms ease;
    }

    .mobile-link {
      padding: $space-3;
      font-size: $text-sm;
      font-weight: 500;
      color: $text-dark;
      border-radius: $radius-md;
      transition: background $transition-base;
      text-decoration: none;

      &:hover {
        background: $bg-light;
      }
    }

    .mobile-cta {
      text-align: center;
      margin-top: $space-2;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .main-content {
      margin-top: $navbar-height;
      min-height: calc(100vh - $navbar-height);
    }

    .footer {
      background: $bg-dark;
      color: $text-light;
      padding: $space-16 0 0;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1.5fr 2fr;
      gap: $space-12;
      padding-bottom: $space-12;

      @include sm {
        grid-template-columns: 1fr;
        gap: $space-8;
      }
    }

    .footer-brand .logo {
      margin-bottom: $space-4;
    }

    .footer-brand .logo-text {
      -webkit-text-fill-color: $text-white;
      background: none;
      color: $text-white;
    }

    .footer-desc {
      font-size: $text-sm;
      line-height: 1.7;
      color: $text-muted;
      max-width: 320px;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-8;

      @include sm {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .footer-col {
      display: flex;
      flex-direction: column;
      gap: $space-3;

      h6 {
        font-size: $text-sm;
        font-weight: 700;
        color: $text-white;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: $space-2;
      }

      a {
        font-size: $text-sm;
        color: $text-muted;
        transition: color $transition-base;

        &:hover {
          color: $primary-light;
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba($text-muted, 0.15);
      padding: $space-6 0;

      p {
        font-size: $text-xs;
        color: $text-muted;
        text-align: center;
      }
    }
  `]
})
export class PublicLayoutComponent implements OnInit {
  mobileMenuOpen = false;
  isLoggedIn = false;
  userName = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.authService.getCurrentUser().subscribe({
        next: (res) => this.userName = res.data?.fullName || 'User'
      });
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.userName = '';
        window.location.href = '/';
      }
    });
  }
}
