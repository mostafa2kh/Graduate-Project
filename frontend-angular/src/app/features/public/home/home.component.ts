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
          <p class="hero-text">Browse trusted apartments, compare clear monthly pricing, and move from search to booking without the usual rental friction.</p>
          <div class="search-bar">
            <div class="search-field">
              <span>City</span>
              <input placeholder="Search city or area" />
            </div>
            <div class="search-field">
              <span>Move-in</span>
              <input placeholder="Flexible" />
            </div>
            <a routerLink="/search" class="btn-search">Search</a>
          </div>
          <div class="city-links">
            @for (city of cities; track city.name) {
              <a routerLink="/search" [queryParams]="{ city: city.name }">{{ city.name }}</a>
            }
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head centered">
            <p class="eyebrow dark">How it works</p>
            <h2>Rent a home in three simple steps.</h2>
          </div>
          <div class="steps">
            @for (step of steps; track step.title) {
              <div class="step">
                <div class="step-number">{{ step.number }}</div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.text }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="section featured">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow dark">Popular destinations</p>
              <h2>Start with the neighborhoods renters ask for most.</h2>
            </div>
            <a routerLink="/search" class="text-link">View all</a>
          </div>
          <div class="city-grid">
            @for (city of cities; track city.name) {
              <a routerLink="/search" [queryParams]="{ city: city.name }" class="city-card">
                <img [src]="city.image" [alt]="city.name" />
                <div class="city-info">
                  <span>{{ city.count }}</span>
                  <h3>{{ city.name }}</h3>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <section class="section cta">
        <div class="container">
          <div class="cta-card">
            <div>
              <p class="eyebrow dark">For landlords</p>
              <h2>List your property and reach thousands of verified renters.</h2>
            </div>
            <a routerLink="/register" class="btn-cta">Become a host</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .home-page { background: #F7F7F7; color: #0D0D0D; }
    .container { max-width: 1200px; }

    .hero {
      position: relative;
      min-height: calc(100vh - 72px);
      display: flex;
      align-items: center;
      overflow: hidden;
      background: #0a0d77;
    }

    .hero-photo, .hero-overlay { position: absolute; inset: 0; }

    .hero-photo {
      background: url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat;
      transform: scale(1.02);
    }

    .hero-overlay { background: linear-gradient(90deg, rgba(#0a0d77, 0.82), rgba(#0a0d77, 0.45) 50%, rgba(#0a0d77, 0.18)); }

    .hero-content { position: relative; z-index: 1; padding-top: 80px; padding-bottom: 80px; }

    .eyebrow {
      margin-bottom: 12px;
      color: #FB6E44;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .eyebrow.dark { color: #FB6E44; }

    .hero h1 {
      max-width: 720px;
      color: #fff;
      font-size: clamp(2.8rem, 5.5vw, 5.5rem);
      line-height: 1;
      letter-spacing: -0.05em;
    }

    .hero-text {
      max-width: 580px;
      margin-top: 20px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.125rem;
      line-height: 1.7;
    }

    .search-bar {
      display: flex;
      max-width: 600px;
      margin-top: 32px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .search-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 14px 18px;
      background: #fff;
    }

    .search-field span { color: #676767; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }

    .search-field input {
      border: none;
      outline: none;
      background: transparent;
      color: #0D0D0D;
      font-size: 0.9375rem;
    }

    .search-field input::placeholder { color: #c7c7c7; }

    .btn-search {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 32px;
      background: #FB6E44;
      color: #fff;
      font-size: 0.9375rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s ease;
    }

    .btn-search:hover { background: #af4d2f; }

    .city-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }

    .city-links a {
      padding: 8px 18px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 100px;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }

    .section { padding: 80px 0; }

    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 32px;
      margin-bottom: 40px;
    }

    .section-head.centered { flex-direction: column; align-items: center; text-align: center; }

    h2 {
      max-width: 700px;
      color: #0D0D0D;
      font-size: clamp(1.8rem, 3vw, 3.2rem);
      line-height: 1.05;
      letter-spacing: -0.045em;
    }

    .text-link {
      color: #FB6E44;
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 4px;
      white-space: nowrap;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .step {
      padding: 36px 28px;
      border: 1px solid rgba(#0D0D0D, 0.08);
      border-radius: 16px;
      background: #fff;
      text-align: center;
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin-bottom: 20px;
      border-radius: 12px;
      background: #FB6E44;
      color: #fff;
      font-size: 1.25rem;
      font-weight: 800;
    }

    .step h3 { margin-bottom: 10px; font-size: 1.125rem; font-weight: 700; }
    .step p { color: #676767; font-size: 0.875rem; line-height: 1.6; }

    .featured { background: #fff; }

    .city-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .city-card {
      position: relative;
      min-height: 310px;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      border-radius: 16px;
      background: #ddd;
      color: #fff;
    }

    .city-card img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .city-card:hover img { transform: scale(1.05); }
    .city-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.7)); }

    .city-info { position: relative; z-index: 1; padding: 20px; }
    .city-info span { color: rgba(255, 255, 255, 0.8); font-size: 0.875rem; }
    .city-info h3 { margin-top: 4px; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.04em; }

    .cta { background: #fff; }

    .cta-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      padding: 48px 40px;
      border: 1px solid rgba(#0D0D0D, 0.08);
      border-radius: 20px;
      background: #FFF0EB;
    }

    .btn-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding: 0 40px;
      border-radius: 100px;
      background: #FB6E44;
      color: #fff;
      font-size: 0.9375rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }

    .btn-cta:hover { background: #af4d2f; }

    @media (max-width: 980px) {
      .search-bar { flex-direction: column; }
      .btn-search { min-height: 56px; }
      .steps, .city-grid { grid-template-columns: 1fr; }
      .section-head, .cta-card { flex-direction: column; align-items: flex-start; }
    }

    @media (max-width: 640px) {
      .hero { min-height: auto; }
      .hero-content { padding-top: 48px; padding-bottom: 48px; }
      .section { padding: 48px 0; }
    }
  `]
})
export class HomeComponent {
  cities = [
    { name: 'Cairo', count: '180+ homes', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Alexandria', count: '95+ homes', image: 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=80' },
    { name: 'Giza', count: '120+ homes', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80' },
  ];

  steps = [
    { number: '1', title: 'Search', text: 'Browse verified listings in your preferred city with transparent pricing.' },
    { number: '2', title: 'Compare', text: 'View detailed property info, trust scores, and landlord profiles.' },
    { number: '3', title: 'Book', text: 'Request a booking, pay securely, and move in with confidence.' },
  ];
}
