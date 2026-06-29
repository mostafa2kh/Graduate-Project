import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { ChatbotComponent } from '../../shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent, ChatbotComponent],
  template: `
    <header class="header" [class.scrolled]="scrolled">
      <div class="header-inner">
        <a routerLink="/" class="logo" aria-label="RentSphere home">
          <img src="https://static.spotahome.com/brand/spotahome/logo.svg" alt="RentSphere" class="logo-img" width="130" />
        </a>

        <nav class="nav" aria-label="Primary navigation">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/search" class="nav-link" routerLinkActive="active">Apartments</a>
          <a routerLink="/how-it-works" class="nav-link">How it works</a>
        </nav>

        <div class="actions">
          @if (isLoggedIn) {
            <a [routerLink]="dashboardLink" class="nav-link">Dashboard</a>
            <a routerLink="/profile" class="btn-outline">{{ userName }}</a>
            <button type="button" class="btn-outline" (click)="onLogout()">Logout</button>
          } @else {
            <a routerLink="/login" class="nav-link">Log in</a>
            <a routerLink="/register" class="btn-primary">I am a Landlord</a>
          }
        </div>

        <button class="mobile-btn" type="button" (click)="mobileOpen = !mobileOpen" aria-label="Toggle menu">
          <span class="hamburger" [class.open]="mobileOpen"><span></span><span></span><span></span></span>
        </button>
      </div>

      @if (mobileOpen) {
        <div class="mobile-menu">
          <a routerLink="/" (click)="mobileOpen = false">Home</a>
          <a routerLink="/search" (click)="mobileOpen = false">Apartments</a>
          <a routerLink="/how-it-works" (click)="mobileOpen = false">How it works</a>
          @if (isLoggedIn) {
            <a [routerLink]="dashboardLink" (click)="mobileOpen = false">Dashboard</a>
            <button type="button" class="btn-primary mobile-cta" (click)="onLogout(); mobileOpen = false">Logout</button>
          } @else {
            <a routerLink="/login" (click)="mobileOpen = false">Log in</a>
            <a routerLink="/register" class="btn-primary mobile-cta" (click)="mobileOpen = false">I am a Landlord</a>
          }
        </div>
      }
    </header>

    <app-toast-container />

    <main class="main">
      <router-outlet />
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="https://static.spotahome.com/brand/spotahome/logo.svg" alt="RentSphere" class="footer-logo" width="130" />
          <p>Premium rentals, verified landlords, secure booking.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h6>Platform</h6>
            <a routerLink="/search">Browse apartments</a>
            <a routerLink="/register">List a property</a>
            <a routerLink="/login">Sign in</a>
          </div>
          <div class="footer-col">
            <h6>Renters</h6>
            <a routerLink="/search">Verified homes</a>
            <a routerLink="/login">Favorites</a>
          </div>
          <div class="footer-col">
            <h6>Support</h6>
            <a routerLink="/settings">Settings</a>
            <a routerLink="/search">Contact landlord</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 RentSphere. All rights reserved.</p>
      </div>
    </footer>
    <app-chatbot/>
  `,
  styles: [`
    @use 'index' as *;

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 72px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(13, 13, 13, 0.08);
      z-index: 1000;
      transition: box-shadow 0.25s ease;
    }

    .header.scrolled { box-shadow: 0 2px 20px rgba(204, 214, 221, 0.3); }

    .header-inner {
      display: flex;
      align-items: center;
      gap: 32px;
      max-width: 1320px;
      height: 100%;
      margin: 0 auto;
      padding: 0 24px;
    }

    .logo { flex-shrink: 0; line-height: 0; }
    .logo-img { display: block; height: 28px; }

    .nav {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;
    }

    .nav-link {
      color: #676767;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }

    .nav-link:hover, .nav-link.active { color: #FB6E44; }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 0 20px;
      border-radius: 100px;
      background: #FB6E44;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-primary:hover { background: #af4d2f; }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 0 20px;
      border: 1px solid rgba(13, 13, 13, 0.12);
      border-radius: 100px;
      background: transparent;
      color: #0D0D0D;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: border-color 0.2s;
    }

    .btn-outline:hover { border-color: #FB6E44; }

    .mobile-btn {
      display: none;
      border: 1px solid rgba(13, 13, 13, 0.12);
      border-radius: 50%;
      width: 42px;
      height: 42px;
      background: #fff;
      margin-left: auto;
    }

    .hamburger { display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .hamburger span { display: block; width: 20px; height: 2px; background: #0D0D0D; border-radius: 2px; transition: transform 0.2s, opacity 0.2s; }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    .mobile-menu {
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      display: none;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: #fff;
      border-bottom: 1px solid rgba(13, 13, 13, 0.1);
      box-shadow: 0 24px 60px rgba(13, 13, 13, 0.1);
    }

    .mobile-menu a {
      display: block;
      padding: 12px 16px;
      border-radius: 12px;
      color: #0D0D0D;
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;
    }

    .mobile-menu a:hover { background: #F7F7F7; }

    .mobile-cta { width: 100%; margin-top: 8px; }

    .main { margin-top: 72px; min-height: calc(100vh - 72px); }

    .footer {
      background: #F7F7F7;
      border-top: 1px solid rgba(13, 13, 13, 0.08);
      padding: 48px 0 0;
    }

    .footer-inner {
      display: grid;
      grid-template-columns: minmax(240px, 1fr) 2fr;
      gap: 48px;
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 24px 32px;
    }

    .footer-logo { height: 28px; margin-bottom: 16px; }
    .footer-brand p { color: #676767; font-size: 0.875rem; line-height: 1.6; }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .footer-col { display: flex; flex-direction: column; gap: 10px; }
    .footer-col h6 { color: #0D0D0D; font-size: 0.75rem; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
    .footer-col a { color: #676767; font-size: 0.875rem; transition: color 0.2s; }
    .footer-col a:hover { color: #FB6E44; }

    .footer-bottom {
      border-top: 1px solid rgba(13, 13, 13, 0.08);
      padding: 20px 24px;
      text-align: center;
    }

    .footer-bottom p { color: #c7c7c7; font-size: 0.75rem; }

    @media (max-width: 900px) {
      .nav, .actions { display: none; }
      .mobile-btn { display: inline-flex; align-items: center; justify-content: center; }
      .mobile-menu { display: flex; }
      .footer-inner { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .header-inner { padding: 0 16px; gap: 16px; }
      .footer-links { grid-template-columns: 1fr; }
    }
  `]
})
export class PublicLayoutComponent implements OnInit {
  mobileOpen = false;
  isLoggedIn = false;
  userName = '';
  dashboardLink = '/dashboard/overview';
  scrolled = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.dashboardLink = this.authService.getDefaultRedirectUrl();
      this.authService.getCurrentUser().subscribe({
        next: (res) => this.userName = res.data?.fullName || 'User'
      });
    }
  }

  @HostListener('window:scroll')
  onScroll(): void { this.scrolled = window.scrollY > 40; }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => { this.isLoggedIn = false; this.userName = ''; window.location.href = '/'; }
    });
  }
}
