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
    <header class="navbar" [class.scrolled]="scrolled">
      <div class="nav-container navbar-content">
        <a routerLink="/" class="logo" aria-label="RentSphere home">
          <span class="logo-mark">RS</span>
          <span class="logo-text">RentSphere</span>
        </a>

        <nav class="nav-links" aria-label="Primary navigation">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/search" class="nav-link" routerLinkActive="active">Apartments</a>
          <a routerLink="/register" class="nav-link">For landlords</a>
        </nav>

        <div class="nav-actions">
          <a routerLink="/search" class="search-trigger" aria-label="Search apartments">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </a>

          @if (isLoggedIn) {
            <a [routerLink]="dashboardLink" class="nav-link">Dashboard</a>
            <a routerLink="/profile" class="profile-pill">{{ userName }}</a>
            <button type="button" class="outline-pill" (click)="onLogout()">Logout</button>
          } @else {
            <a routerLink="/login" class="nav-link">Log in</a>
            <a routerLink="/register" class="host-pill">List your property</a>
          }
        </div>

        <button class="mobile-menu-btn" type="button" (click)="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
          <span class="hamburger" [class.open]="mobileMenuOpen">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>

      @if (mobileMenuOpen) {
        <div class="mobile-menu">
          <a routerLink="/" class="mobile-link" (click)="mobileMenuOpen = false">Home</a>
          <a routerLink="/search" class="mobile-link" (click)="mobileMenuOpen = false">Apartments</a>
          <a routerLink="/register" class="mobile-link" (click)="mobileMenuOpen = false">For landlords</a>
          @if (isLoggedIn) {
            <a [routerLink]="dashboardLink" class="mobile-link" (click)="mobileMenuOpen = false">Dashboard</a>
            <a routerLink="/profile" class="mobile-link" (click)="mobileMenuOpen = false">Profile</a>
            <button type="button" class="host-pill mobile-cta" (click)="onLogout(); mobileMenuOpen = false">Logout</button>
          } @else {
            <a routerLink="/login" class="mobile-link" (click)="mobileMenuOpen = false">Log in</a>
            <a routerLink="/register" class="host-pill mobile-cta" (click)="mobileMenuOpen = false">List your property</a>
          }
        </div>
      }
    </header>

    <app-toast-container />

    <main class="main-content">
      <router-outlet />
    </main>

    <footer class="footer">
      <div class="nav-container footer-content">
        <div class="footer-brand">
          <a routerLink="/" class="logo">
            <span class="logo-mark footer-mark">RS</span>
            <span class="logo-text footer-logo-text">RentSphere</span>
          </a>
          <p class="footer-desc">
            Premium rentals, verified landlords, secure booking, and clear move-in support for modern renters.
          </p>
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
            <a routerLink="/verification">KYC verification</a>
          </div>
          <div class="footer-col">
            <h6>Support</h6>
            <a routerLink="/profile">Account</a>
            <a routerLink="/settings">Settings</a>
            <a routerLink="/search">Contact landlord</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="nav-container">
          <p>&copy; 2026 RentSphere. All rights reserved. Built for Menoufia University.</p>
        </div>
      </div>
    </footer>
    <app-chatbot/>
  `,
  styles: [`
    @use 'index' as *;

    .nav-container {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 $space-8;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: $navbar-height;
      background: rgba(#fffdf8, 0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(#13211f, 0.09);
      z-index: 1000;
      transition: background $transition-base, border-color $transition-base, box-shadow $transition-base;
    }

    .navbar.scrolled {
      background: rgba(#fffdf8, 0.98);
      border-bottom-color: rgba(#13211f, 0.14);
      box-shadow: 0 1px 20px rgba(#13211f, 0.06);
    }

    .navbar-content {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: $space-6;
      height: 100%;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: $space-3;
      text-decoration: none;
    }

    .logo-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 38px;
      background: #13211f;
      color: $text-white;
      border-radius: 13px;
      font-weight: 950;
      font-size: $text-sm;
      letter-spacing: -0.04em;
    }

    .logo-text {
      color: #13211f;
      font-size: $text-xl;
      font-weight: 950;
      letter-spacing: -0.05em;
    }

    .nav-links, .nav-actions {
      display: flex;
      align-items: center;
      gap: $space-6;
    }

    .nav-links { justify-content: center; }

    .nav-link {
      position: relative;
      color: #52615e;
      font-size: $text-sm;
      font-weight: 750;
      text-decoration: none;
      transition: color $transition-base;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: #dac49b;
      border-radius: 2px;
      transition: width $transition-base;
    }

    .nav-link:hover { color: #13211f; }

    .nav-link.active {
      color: #13211f;
    }

    .nav-link.active::after { width: 100%; }

    .search-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: 1px solid rgba(#13211f, 0.12);
      border-radius: 50%;
      color: #52615e;
      transition: all $transition-base;
    }

    .search-trigger:hover {
      border-color: #13211f;
      color: #13211f;
    }

    .host-pill, .outline-pill, .profile-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 0 $space-5;
      border-radius: $radius-full;
      font-size: $text-sm;
      font-weight: 900;
      text-decoration: none;
      transition: transform $transition-base, background $transition-base, border-color $transition-base;
    }

    .host-pill {
      border: 1px solid #13211f;
      background: #13211f;
      color: $text-white;
    }

    .host-pill:hover {
      background: #28423d;
      transform: translateY(-1px);
    }

    .outline-pill, .profile-pill {
      border: 1px solid rgba(#13211f, 0.16);
      background: $card-light;
      color: #13211f;
    }

    .outline-pill:hover, .profile-pill:hover {
      border-color: #13211f;
      transform: translateY(-1px);
    }

    .mobile-menu-btn {
      display: none;
      justify-self: end;
      border: 1px solid rgba(#13211f, 0.14);
      border-radius: 50%;
      width: 42px;
      height: 42px;
      background: $card-light;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .hamburger span {
      display: block;
      width: 20px;
      height: 2px;
      background: #13211f;
      border-radius: 2px;
      transition: transform $transition-base, opacity $transition-base;
    }

    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    .mobile-menu {
      position: absolute;
      top: $navbar-height;
      left: 0;
      right: 0;
      display: none;
      flex-direction: column;
      gap: $space-2;
      padding: $space-4;
      background: #fffdf8;
      border-bottom: 1px solid rgba(#13211f, 0.1);
      box-shadow: 0 24px 60px rgba(#13211f, 0.12);
      animation: slideDown 180ms ease;
    }

    .mobile-link {
      display: block;
      padding: $space-3 $space-4;
      border-radius: 16px;
      color: #13211f;
      font-size: $text-sm;
      font-weight: 800;
      text-decoration: none;
    }

    .mobile-link:hover { background: #f4ede0; }

    .mobile-cta { width: 100%; margin-top: $space-2; }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .main-content {
      margin-top: $navbar-height;
      min-height: calc(100vh - $navbar-height);
    }

    .footer {
      background: #101917;
      color: rgba($text-white, 0.7);
      padding: $space-16 0 0;
    }

    .footer-content {
      display: grid;
      grid-template-columns: minmax(260px, 1fr) 2fr;
      gap: $space-12;
      padding-bottom: $space-12;
    }

    .footer-brand .logo { margin-bottom: $space-4; }
    .footer-mark { background: #dac49b; color: #13211f; }
    .footer-logo-text { color: $text-white; }

    .footer-desc {
      max-width: 360px;
      color: rgba($text-white, 0.62);
      font-size: $text-sm;
      line-height: 1.75;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-8;
    }

    .footer-col {
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }

    .footer-col h6 {
      margin-bottom: $space-2;
      color: $text-white;
      font-size: $text-sm;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .footer-col a {
      color: rgba($text-white, 0.58);
      font-size: $text-sm;
      transition: color $transition-base;
    }

    .footer-col a:hover { color: #dac49b; }

    .footer-bottom {
      border-top: 1px solid rgba($text-white, 0.1);
      padding: $space-6 0;
    }

    .footer-bottom p {
      color: rgba($text-white, 0.44);
      font-size: $text-xs;
      text-align: center;
    }

    @media (max-width: 900px) {
      .navbar-content { grid-template-columns: auto 1fr auto; }
      .nav-links, .nav-actions { display: none; }
      .mobile-menu-btn { display: inline-flex; align-items: center; justify-content: center; }
      .mobile-menu { display: flex; }
      .footer-content { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .nav-container { padding: 0 $space-4; }
      .logo-text { font-size: $text-lg; }
      .footer-links { grid-template-columns: 1fr; }
    }
  `]
})
export class PublicLayoutComponent implements OnInit {
  mobileMenuOpen = false;
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
  onScroll(): void {
    this.scrolled = window.scrollY > 40;
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
