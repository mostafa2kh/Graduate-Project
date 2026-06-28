import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Find Your Perfect<br/>
            <span class="text-gradient">Rental Home</span>
          </h1>
          <p class="hero-subtitle">
            RentSphere connects you with trusted landlords and verified properties.
            Browse, book, and move in — all in one place.
          </p>
          <div class="hero-cta">
            <a routerLink="/register" class="btn-primary btn-lg">Get Started</a>
            <a routerLink="/search" class="btn-outline btn-lg">Browse Listings</a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">Properties</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">1,200+</span>
              <span class="stat-label">Happy Tenants</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">98%</span>
              <span class="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-card">
            <div class="hero-card-header">
              <div class="hero-card-dots"><span></span><span></span><span></span></div>
            </div>
            <div class="hero-card-body">
              <div class="hero-card-image"></div>
              <div class="hero-card-info">
                <div class="hero-card-title"></div>
                <div class="hero-card-price"></div>
                <div class="hero-card-features">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-card-secondary">
            <div class="hero-card-body">
              <div class="hero-card-image small"></div>
              <div class="hero-card-info">
                <div class="hero-card-title short"></div>
                <div class="hero-card-price short"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose <span class="text-gradient">RentSphere</span></h2>
          <p class="section-subtitle">
            We make renting simple, secure, and stress-free for everyone.
          </p>
        </div>

        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <div class="feature-card">
              <div class="feature-icon" [style.background]="feature.iconBg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [style.color]="feature.iconColor">
                  <path [attr.d]="feature.iconPath"/>
                </svg>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section how-it-works" style="background: $bg-gray;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How It <span class="text-gradient">Works</span></h2>
          <p class="section-subtitle">
            Three simple steps to find your next rental home.
          </p>
        </div>

        <div class="steps">
          @for (step of steps; track step.number) {
            <div class="step-card">
              <div class="step-number">{{ step.number }}</div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta">
      <div class="container">
        <div class="cta-card">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Find Your Next Home?</h2>
            <p class="cta-subtitle">
              Join thousands of satisfied renters and landlords on RentSphere.
            </p>
            <a routerLink="/register" class="btn-primary btn-lg">Create Free Account</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use 'index' as *;

    // Hero
    .hero {
      position: relative;
      min-height: calc(100vh - $navbar-height);
      display: flex;
      align-items: center;
      overflow: hidden;
      background: linear-gradient(135deg, $primary-bg 0%, $secondary-bg 50%, $accent-bg 100%);
    }

    .hero-bg {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba($primary, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-12;
      align-items: center;
      padding-top: $space-8;
      padding-bottom: $space-8;

      @include lg {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: $space-6;
      color: $text-dark;

      @include sm {
        font-size: 2.5rem;
      }
    }

    .hero-subtitle {
      font-size: $text-lg;
      color: $text-muted;
      margin-bottom: $space-8;
      max-width: 540px;
      line-height: 1.7;

      @include lg {
        margin-left: auto;
        margin-right: auto;
      }
    }

    .hero-cta {
      display: flex;
      gap: $space-4;
      margin-bottom: $space-12;

      @include lg {
        justify-content: center;
      }

      @include sm {
        flex-direction: column;
        align-items: center;
      }
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: $space-8;

      @include lg {
        justify-content: center;
      }
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: $space-1;
    }

    .stat-number {
      font-size: $text-2xl;
      font-weight: 800;
      color: $text-dark;
    }

    .stat-label {
      font-size: $text-sm;
      color: $text-muted;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: $card-border;
    }

    // Hero Visual Cards
    .hero-visual {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: $space-4;

      @include lg {
        display: none;
      }
    }

    .hero-card {
      background: $card-light;
      border-radius: $radius-xl;
      box-shadow: $shadow-xl;
      overflow: hidden;
      max-width: 420px;
      transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
      transition: transform $transition-slow;

      &:hover {
        transform: perspective(1000px) rotateY(-3deg) rotateX(1deg) translateY(-4px);
      }
    }

    .hero-card-header {
      padding: $space-4 $space-6;
      display: flex;
      align-items: center;
    }

    .hero-card-dots {
      display: flex;
      gap: 6px;

      span {
        width: 10px;
        height: 10px;
        border-radius: 50%;

        &:nth-child(1) { background: #EF4444; }
        &:nth-child(2) { background: #F59E0B; }
        &:nth-child(3) { background: #22C55E; }
      }
    }

    .hero-card-body {
      padding: $space-6;
      display: flex;
      gap: $space-4;
    }

    .hero-card-image {
      width: 120px;
      height: 100px;
      background: linear-gradient(135deg, $primary, $secondary);
      border-radius: $radius-md;
      flex-shrink: 0;
      opacity: 0.15;
    }

    .hero-card-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }

    .hero-card-title {
      height: 16px;
      width: 70%;
      background: $bg-gray;
      border-radius: 4px;
    }

    .hero-card-price {
      height: 12px;
      width: 40%;
      background: $bg-gray;
      border-radius: 4px;
    }

    .hero-card-features {
      display: flex;
      gap: $space-3;
      margin-top: $space-2;

      span {
        height: 8px;
        width: 50px;
        background: $bg-gray;
        border-radius: 4px;
      }
    }

    .hero-card-secondary {
      @extend .hero-card;
      max-width: 340px;
      margin-left: 60px;
      transform: perspective(1000px) rotateY(-3deg) rotateX(1deg);
      opacity: 0.7;

      .hero-card-image.small {
        width: 80px;
        height: 70px;
      }

      .hero-card-title.short { width: 50%; }
      .hero-card-price.short { width: 30%; }
    }

    // Section Header
    .section-header {
      text-align: center;
      margin-bottom: $space-12;
    }

    // Features Grid
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-6;

      @include lg {
        grid-template-columns: repeat(2, 1fr);
      }

      @include sm {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      @include card;
      padding: $space-8;
      transition: transform $transition-base, box-shadow $transition-base;

      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-lg;
      }
    }

    .feature-icon {
      width: 52px;
      height: 52px;
      border-radius: $radius-lg;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: $space-5;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .feature-title {
      font-size: $text-lg;
      font-weight: 700;
      margin-bottom: $space-2;
    }

    .feature-desc {
      font-size: $text-sm;
      color: $text-muted;
      line-height: 1.7;
    }

    // Steps
    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-8;
      position: relative;

      @include lg {
        grid-template-columns: repeat(2, 1fr);
      }

      @include sm {
        grid-template-columns: 1fr;
      }
    }

    .step-card {
      text-align: center;
      padding: $space-8;
      background: $card-light;
      border-radius: $radius-xl;
      box-shadow: $shadow-sm;
      position: relative;
      transition: transform $transition-base;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .step-number {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, $primary, $secondary);
      color: $text-white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $text-lg;
      font-weight: 800;
      margin: 0 auto $space-5;
    }

    .step-title {
      font-size: $text-lg;
      font-weight: 700;
      margin-bottom: $space-3;
    }

    .step-desc {
      font-size: $text-sm;
      color: $text-muted;
      line-height: 1.7;
    }

    // CTA
    .cta-card {
      background: linear-gradient(135deg, $primary, $secondary);
      border-radius: $radius-xl;
      padding: $space-16 $space-8;
      text-align: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 400px;
        height: 400px;
        background: rgba($text-white, 0.05);
        border-radius: 50%;
      }
    }

    .cta-content {
      position: relative;
      z-index: 1;
    }

    .cta-title {
      font-size: $text-4xl;
      font-weight: 800;
      color: $text-white;
      margin-bottom: $space-4;

      @include sm {
        font-size: $text-2xl;
      }
    }

    .cta-subtitle {
      font-size: $text-lg;
      color: rgba($text-white, 0.85);
      margin-bottom: $space-8;
    }
  `]
})
export class HomeComponent {
  features = [
    {
      title: 'Verified Properties',
      description: 'Every listing is reviewed and verified by our team to ensure quality and accuracy.',
      iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
    },
    {
      title: 'Secure Booking',
      description: 'Our platform handles bookings and payments securely so you can rent with confidence.',
      iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
    },
    {
      title: 'Direct Chat',
      description: 'Communicate directly with landlords and get answers to all your questions instantly.',
      iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      iconBg: '#ECFEFF',
      iconColor: '#06B6D4',
    },
    {
      title: 'Trust Score',
      description: 'Each listing includes an AI-powered trust score to help you make informed decisions.',
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      iconBg: '#F0FDF4',
      iconColor: '#22C55E',
    },
    {
      title: 'KYC Verified',
      description: 'Landlords and renters can verify their identity for a trusted community.',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: '#FFFBEB',
      iconColor: '#F59E0B',
    },
    {
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you with any questions or issues.',
      iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
      iconBg: '#FEF2F2',
      iconColor: '#EF4444',
    },
  ];

  steps = [
    { number: 1, title: 'Browse Listings', description: 'Explore our extensive collection of verified rental properties with detailed information and photos.' },
    { number: 2, title: 'Book & Pay', description: 'Submit a booking request, get approved by the landlord, and complete secure payment.' },
    { number: 3, title: 'Move In', description: 'Get your keys and move in. Our support team is here for you throughout your rental journey.' },
  ];
}
