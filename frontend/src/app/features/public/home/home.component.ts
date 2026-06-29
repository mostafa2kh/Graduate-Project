import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-page">
      <section class="hero">
        <div class="hero-photo" aria-hidden="true"></div>
        <div class="hero-overlay" aria-hidden="true"></div>

        <div class="container hero-content">
          <p class="eyebrow">Verified furnished rentals</p>
          <h1>Find a move-in ready home that fits your life.</h1>
          <p class="hero-text">
            Browse trusted apartments, compare clear monthly pricing, and move from search to booking without the usual rental friction.
          </p>

          <div class="search-card">
            <div class="search-field main-field">
              <span>Where</span>
              <strong>Cairo, Alexandria, Giza</strong>
            </div>
            <div class="search-field">
              <span>Stay</span>
              <strong>Monthly rentals</strong>
            </div>
            <div class="search-field">
              <span>Homes</span>
              <strong>Verified listings</strong>
            </div>
            <a routerLink="/search" class="search-button">Search homes</a>
          </div>

          <div class="city-links" aria-label="Popular cities">
            @for (city of cities; track city.name) {
              <a routerLink="/search" [queryParams]="{ city: city.name }">{{ city.name }}</a>
            }
          </div>
        </div>
      </section>

      <section class="section welcome">
        <div class="container">
          <div class="section-head centered">
            <p class="eyebrow dark">Welcome to RentSphere</p>
            <h2 class="centered-title">Everything you need, nothing you don't.</h2>
            <p class="section-subtitle">
              From verified listings to secure booking — we make renting feel like home.
            </p>
          </div>

          <div class="feature-grid">
            @for (item of features; track item.title) {
              <article class="feature-card">
                <div class="feature-icon">{{ item.icon }}</div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="section destinations">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow dark">Popular destinations</p>
              <h2>Start with the neighborhoods renters ask for most.</h2>
            </div>
            <a routerLink="/search" class="text-link">View all listings</a>
          </div>

          <div class="city-grid">
            @for (city of cities; track city.name) {
              <a routerLink="/search" [queryParams]="{ city: city.name }" class="city-card">
                <img [src]="city.image" [alt]="city.name" />
                <div>
                  <span>{{ city.count }}</span>
                  <h3>{{ city.name }}</h3>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <section class="section lifestyle">
        <div class="container">
          <div class="section-head centered">
            <p class="eyebrow dark">Find what suits your lifestyle</p>
            <h2 class="centered-title">One platform, every rental need.</h2>
            <p class="section-subtitle">
              Whether you're finding a home, listing a property, or managing a portfolio.
            </p>
          </div>

          <div class="lifestyle-grid">
            @for (item of lifestyleCards; track item.title) {
              <a [routerLink]="item.link" class="lifestyle-card" [style.--card-bg]="item.bgColor">
                <div class="lifestyle-image" [style.background-image]="'url(' + item.image + ')'" aria-hidden="true"></div>
                <div class="lifestyle-body">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.text }}</p>
                  <span class="lifestyle-cta">Learn more &#8594;</span>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <section class="section trusts">
        <div class="container trust-content">
          <div class="trust-text">
            <p class="eyebrow dark">Powered by trust</p>
            <h2>Transparency at every step of your rental journey.</h2>
            <p class="section-copy">
              Every listing includes verified landlord profiles, trust scores, and real reviews so you can book with confidence.
            </p>
            <a routerLink="/search" class="trust-cta">Start exploring</a>
          </div>

          <div class="trust-stats">
            @for (stat of stats; track stat.number) {
              <div class="stat-card">
                <span class="stat-number">{{ stat.number }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="section owners">
        <div class="container owner-card">
          <div>
            <p class="eyebrow dark">For landlords</p>
            <h2>List your property, manage requests, and build renter trust from one dashboard.</h2>
          </div>
          <a routerLink="/register" class="owner-button">Become a host</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .home-page { background: #fbfaf6; color: #13211f; }
    .container { max-width: 1240px; }

    .hero {
      position: relative;
      min-height: calc(100vh - $navbar-height);
      display: flex;
      align-items: center;
      overflow: hidden;
      background: #13211f;
    }

    .hero-photo, .hero-overlay {
      position: absolute;
      inset: 0;
    }

    .hero-photo {
      background: url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat;
      transform: scale(1.02);
    }

    .hero-overlay {
      background: linear-gradient(90deg, rgba(#09110f, 0.78), rgba(#09110f, 0.48) 45%, rgba(#09110f, 0.16));
    }

    .hero-content {
      position: relative;
      z-index: 1;
      padding-top: $space-20;
      padding-bottom: $space-20;
    }

    .eyebrow {
      margin-bottom: $space-3;
      color: #dbc391;
      font-size: $text-xs;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .eyebrow.dark { color: #8a6a35; }

    .hero h1 {
      max-width: 780px;
      color: $text-white;
      font-size: clamp(2.9rem, 6vw, 5.9rem);
      line-height: 0.98;
      letter-spacing: -0.06em;
    }

    .hero-text {
      max-width: 620px;
      margin-top: $space-5;
      color: rgba($text-white, 0.82);
      font-size: $text-lg;
      line-height: 1.75;
    }

    .search-card {
      display: grid;
      grid-template-columns: 1.2fr 0.72fr 0.8fr auto;
      gap: 1px;
      max-width: 940px;
      margin-top: $space-8;
      overflow: hidden;
      border: 1px solid rgba($text-white, 0.18);
      border-radius: 18px;
      background: rgba($text-white, 0.3);
      box-shadow: 0 22px 60px rgba(#000, 0.26);
    }

    .search-field {
      padding: $space-4 $space-5;
      background: rgba($text-white, 0.96);
    }

    .search-field span, .search-field strong { display: block; }
    .search-field span { color: #7a8582; font-size: $text-xs; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .search-field strong { margin-top: $space-1; color: #13211f; font-size: $text-sm; }

    .search-button, .owner-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      padding: 0 $space-8;
      background: #13211f;
      color: $text-white;
      font-size: $text-sm;
      font-weight: 900;
      transition: background $transition-base;
      white-space: nowrap;
    }

    .search-button:hover, .owner-button:hover { background: #2b403b; }

    .city-links {
      display: flex;
      flex-wrap: wrap;
      gap: $space-3;
      margin-top: $space-6;
    }

    .city-links a {
      padding: $space-2 $space-4;
      border: 1px solid rgba($text-white, 0.26);
      border-radius: $radius-full;
      color: $text-white;
      font-size: $text-sm;
      font-weight: 800;
      backdrop-filter: blur(8px);
    }

    .section { padding: $space-20 0; }

    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: $space-8;
      margin-bottom: $space-10;
    }

    .section-head.centered {
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: $space-12;
    }

    h2 {
      max-width: 760px;
      color: #13211f;
      font-size: clamp(2rem, 3.5vw, 3.8rem);
      line-height: 1.02;
      letter-spacing: -0.055em;
    }

    .centered-title { text-align: center; max-width: 620px; }

    .section-subtitle {
      max-width: 540px;
      margin-top: $space-4;
      color: #63716e;
      font-size: $text-base;
      line-height: 1.7;
      text-align: center;
    }

    .text-link {
      color: #8a6a35;
      font-size: $text-sm;
      font-weight: 900;
      text-decoration: underline;
      text-underline-offset: 5px;
      white-space: nowrap;
    }

    .city-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-5;
    }

    .city-card {
      position: relative;
      min-height: 330px;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      border-radius: 22px;
      background: #ddd;
      color: $text-white;
    }

    .city-card img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-slow;
    }

    .city-card:hover img { transform: scale(1.05); }
    .city-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(#000, 0.72)); }
    .city-card div { position: relative; z-index: 1; padding: $space-5; }
    .city-card span { color: rgba($text-white, 0.78); font-size: $text-sm; }
    .city-card h3 { margin-top: $space-1; font-size: $text-3xl; letter-spacing: -0.045em; }

    .welcome { background: #fff; border-bottom: 1px solid rgba(#13211f, 0.08); }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $space-6;
    }

    .feature-card {
      padding: $space-8 $space-6;
      border: 1px solid rgba(#13211f, 0.08);
      border-radius: 18px;
      background: #fbfaf6;
      transition: transform $transition-base, box-shadow $transition-base;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(#13211f, 0.08);
    }

    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin-bottom: $space-4;
      border-radius: 14px;
      background: #13211f;
      color: #dac49b;
      font-size: $text-xl;
      font-weight: 900;
    }

    .feature-card h3 {
      margin-bottom: $space-3;
      color: #13211f;
      font-size: $text-lg;
      font-weight: 900;
      letter-spacing: -0.03em;
    }

    .feature-card p {
      color: #63716e;
      font-size: $text-sm;
      line-height: 1.7;
    }

    .lifestyle { background: #fff; }

    .lifestyle-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $space-5;
    }

    .lifestyle-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 20px;
      background: #fff;
      border: 1px solid rgba(#13211f, 0.08);
      color: inherit;
      text-decoration: none;
      transition: transform $transition-base, box-shadow $transition-base;
    }

    .lifestyle-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(#13211f, 0.1);
    }

    .lifestyle-image {
      height: 200px;
      background-size: cover;
      background-position: center;
    }

    .lifestyle-body {
      padding: $space-6;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .lifestyle-body h3 {
      margin-bottom: $space-3;
      font-size: $text-xl;
      font-weight: 900;
      letter-spacing: -0.03em;
    }

    .lifestyle-body p {
      color: #63716e;
      font-size: $text-sm;
      line-height: 1.7;
      margin-bottom: $space-4;
      flex: 1;
    }

    .lifestyle-cta {
      color: #8a6a35;
      font-size: $text-sm;
      font-weight: 900;
    }

    .trusts { background: #fff; border-top: 1px solid rgba(#13211f, 0.08); }

    .trust-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-16;
      align-items: center;
    }

    .trust-text h2 { max-width: 520px; }
    .section-copy { max-width: 480px; margin-top: $space-5; color: #63716e; font-size: $text-base; line-height: 1.8; }

    .trust-cta {
      display: inline-block;
      margin-top: $space-6;
      padding: $space-3 $space-8;
      border: 1px solid #13211f;
      border-radius: $radius-full;
      background: #13211f;
      color: $text-white;
      font-size: $text-sm;
      font-weight: 900;
      text-decoration: none;
      transition: background $transition-base;
    }

    .trust-cta:hover { background: #2b403b; }

    .trust-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-5;
    }

    .stat-card {
      padding: $space-8;
      border: 1px solid rgba(#13211f, 0.08);
      border-radius: 18px;
      background: #fbfaf6;
      text-align: center;
    }

    .stat-number {
      display: block;
      color: #13211f;
      font-size: $text-5xl;
      font-weight: 950;
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .stat-label {
      display: block;
      margin-top: $space-2;
      color: #63716e;
      font-size: $text-sm;
      font-weight: 600;
    }

    .owner-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-8;
      padding: $space-10;
      border: 1px solid rgba(#13211f, 0.08);
      border-radius: 24px;
      background: #f1eadc;
    }

    .owner-button {
      min-height: 52px;
      border-radius: $radius-full;
    }

    @media (max-width: 1080px) {
      .feature-grid { grid-template-columns: repeat(2, 1fr); }
      .lifestyle-grid { grid-template-columns: 1fr; }
      .trust-content { grid-template-columns: 1fr; gap: $space-10; }
    }

    @media (max-width: 980px) {
      .search-card, .city-grid { grid-template-columns: 1fr; }
      .search-button { min-height: 56px; }
      .section-head, .owner-card { align-items: flex-start; flex-direction: column; }
      .hero-overlay { background: rgba(#09110f, 0.68); }
    }

    @media (max-width: 640px) {
      .hero { min-height: auto; }
      .hero-content { padding-top: $space-12; padding-bottom: $space-12; }
      .hero h1 { font-size: clamp(2.4rem, 13vw, 3.8rem); }
      .section { padding: $space-16 0; }
      .feature-grid { grid-template-columns: 1fr; }
      .owner-card { padding: $space-6; }
      .trust-stats { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent {
  cities = [
    { name: 'Cairo', count: '180+ homes', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Alexandria', count: '95+ homes', image: 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=80' },
    { name: 'Giza', count: '120+ homes', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80' },
  ];

  features = [
    { icon: '01', title: 'Verified listings', text: 'Every property is reviewed for accuracy. What you see is what you get.' },
    { icon: '02', title: 'Simple booking', text: 'Search, compare, request, and pay — all from one dashboard.' },
    { icon: '03', title: 'Trust scores', text: 'Landlord profiles include ratings, reviews, and verification badges.' },
    { icon: '04', title: 'Secure payments', text: 'Payments are processed securely through our platform with clear records.' },
  ];

  lifestyleCards = [
    { title: 'For Renters', text: 'Browse verified homes, compare pricing, and book your next rental with confidence.', link: '/search', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', bgColor: '#fbfaf6' },
    { title: 'For Landlords', text: 'List your property, manage bookings, and build renter trust through verified profiles.', link: '/register', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80', bgColor: '#fbfaf6' },
    { title: 'For Businesses', text: 'Relocate your team with furnished rentals, bulk bookings, and centralized billing.', link: '/search', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', bgColor: '#fbfaf6' },
  ];

  stats = [
    { number: '500+', label: 'Verified listings across Egypt' },
    { number: '98%', label: 'Renter satisfaction rate' },
    { number: '24h', label: 'Average response time' },
    { number: '4.8', label: 'Average landlord trust score' },
  ];
}
