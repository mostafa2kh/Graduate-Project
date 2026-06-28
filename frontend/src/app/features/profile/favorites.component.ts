import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
        <div>
          <h1 class="section-title">My Favorites</h1>
          <p class="section-subtitle">Listings you've saved for later</p>
        </div>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="skeleton" style="height: 120px; margin-bottom: 1rem;"></div>
          <div class="skeleton" style="height: 120px; margin-bottom: 1rem;"></div>
          <div class="skeleton" style="height: 120px;"></div>
        </div>
      } @else if (favorites.length === 0) {
        <div class="empty-page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <h3>No favorites yet</h3>
          <p>Start browsing listings and save the ones you like</p>
          <a routerLink="/listings" class="btn-primary">Browse Listings</a>
        </div>
      } @else {
        <div class="favorites-grid">
          @for (id of favorites; track id) {
            <div class="card favorite-item">
              <div class="favorite-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="favorite-info">
                <p class="favorite-label">Listing</p>
                <p class="favorite-id">{{ id }}</p>
              </div>
              <button class="btn-outline btn-sm" (click)="removeFavorite(id)">Remove</button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .empty-page {
      text-align: center;
      padding: $space-16 $space-4;

      .empty-icon {
        width: 64px;
        height: 64px;
        color: $text-light;
        margin-bottom: $space-4;
      }

      h3 {
        font-size: $text-xl;
        font-weight: 700;
        margin-bottom: $space-2;
      }

      p {
        font-size: $text-sm;
        color: $text-muted;
        margin-bottom: $space-6;
      }
    }

    .favorites-grid {
      display: grid;
      gap: $space-4;
    }

    .favorite-item {
      display: flex;
      align-items: center;
      gap: $space-4;
      padding: $space-4;
    }

    .favorite-placeholder {
      width: 60px;
      height: 60px;
      background: $bg-gray;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 28px;
        height: 28px;
        color: $text-light;
      }
    }

    .favorite-info {
      flex: 1;
    }

    .favorite-label {
      font-size: $text-xs;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .favorite-id {
      font-size: $text-sm;
      font-weight: 600;
      font-family: monospace;
      color: $text-muted;
      margin-top: $space-1;
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: string[] = [];
  loading = true;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.profileService.getFavorites().subscribe({
      next: (res) => {
        this.favorites = res.data || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  removeFavorite(listingId: string): void {
    this.profileService.removeFavorite(listingId).subscribe({
      next: () => this.favorites = this.favorites.filter(f => f !== listingId)
    });
  }
}
