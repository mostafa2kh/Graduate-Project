import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { ProfileData } from '../../core/models/profile.models';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  template: `
    <div class="profile-page">
      <div class="profile-header">
        <div class="container">
          <div class="profile-info">
            <div class="avatar">
              <span class="avatar-letter">{{ (profile?.fullName || 'U')[0] }}</span>
            </div>
            <div>
              <h1 class="profile-name">{{ profile?.fullName || 'Your Profile' }}</h1>
              <p class="profile-email">{{ profile?.email }}</p>
              <span class="verification-badge" [class.verified]="profile?.verified">
                {{ profile?.verified ? 'Verified' : 'Unverified' }}
              </span>
            </div>
          </div>
          <div class="profile-meta">
            <div class="meta-item">
              <span class="meta-label">Member since</span>
              <span class="meta-value">{{ profile?.createdAt | date:'MMM yyyy' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Role</span>
              <span class="meta-value">{{ profile?.landlord ? 'Landlord' : 'Renter' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="profile-grid">
          <div class="card profile-form-card">
            <div class="card-header"><h3>Personal Information</h3></div>
            <div class="card-body">
              <form (ngSubmit)="onSave()">
                <div class="form-group">
                  <label>Full Name</label>
                  <input class="input-field" [(ngModel)]="editProfile.fullName" name="fullName" required />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Phone</label>
                    <input class="input-field" [(ngModel)]="editProfile.phone" name="phone" />
                  </div>
                  <div class="form-group">
                    <label>City</label>
                    <input class="input-field" [(ngModel)]="editProfile.city" name="city" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Area</label>
                  <input class="input-field" [(ngModel)]="editProfile.area" name="area" />
                </div>
                <div class="form-group">
                  <label>Bio</label>
                  <textarea class="input-field" rows="3" [(ngModel)]="editProfile.bio" name="bio"></textarea>
                </div>
                <button type="submit" class="btn-primary" [disabled]="saving">
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </form>
            </div>
          </div>

          <div class="profile-sidebar">
            <div class="card verification-card">
              <div class="card-header"><h3>Verification</h3></div>
              <div class="card-body">
                <div class="verification-status">
                  <div class="status-icon" [class.done]="profile?.verified">
                    @if (profile?.verified) {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    }
                  </div>
                  <p class="status-message">{{ verificationMessage }}</p>
                  <a routerLink="/verification" class="btn-outline btn-sm">Manage KYC</a>
                </div>
              </div>
            </div>

            <div class="card favorites-card">
              <div class="card-header"><h3>Favorites</h3></div>
              <div class="card-body">
                @if (favorites.length === 0) {
                  <div class="empty-state">
                    <p>No favorites yet</p>
                    <a routerLink="/listings" class="btn-outline btn-sm">Browse Listings</a>
                  </div>
                } @else {
                  <p>{{ favorites.length }} listing(s) saved</p>
                  <a routerLink="/favorites" class="btn-outline btn-sm">View Favorites</a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .profile-header {
      background: linear-gradient(135deg, $primary-bg, $secondary-bg);
      border-bottom: 1px solid $card-border;
      padding: $space-10 0;
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: $space-6;
      margin-bottom: $space-4;
    }

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, $primary, $secondary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-letter {
      font-size: $text-2xl;
      font-weight: 800;
      color: $text-white;
    }

    .profile-name {
      font-size: $text-2xl;
      font-weight: 800;
    }

    .profile-email {
      font-size: $text-sm;
      color: $text-muted;
      margin-top: $space-1;
    }

    .verification-badge {
      display: inline-block;
      margin-top: $space-2;
      padding: $space-1 $space-3;
      border-radius: $radius-full;
      font-size: $text-xs;
      font-weight: 600;
      background: $warning-bg;
      color: $warning;

      &.verified {
        background: $success-bg;
        color: $success;
      }
    }

    .profile-meta {
      display: flex;
      gap: $space-8;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: $space-1;
    }

    .meta-label {
      font-size: $text-xs;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .meta-value {
      font-size: $text-sm;
      font-weight: 600;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: $space-6;
      padding: $space-8 0;

      @include lg {
        grid-template-columns: 1fr;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-4;

      @include sm {
        grid-template-columns: 1fr;
      }
    }

    .profile-sidebar {
      display: flex;
      flex-direction: column;
      gap: $space-6;
    }

    .verification-card,
    .favorites-card {
      text-align: center;
    }

    .verification-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-4;
    }

    .status-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: $warning-bg;
      color: $warning;
      display: flex;
      align-items: center;
      justify-content: center;

      &.done {
        background: $success-bg;
        color: $success;
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .status-message {
      font-size: $text-sm;
      color: $text-muted;
    }

    .empty-state {
      p {
        font-size: $text-sm;
        color: $text-muted;
        margin-bottom: $space-4;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: ProfileData | null = null;
  editProfile: any = {};
  favorites: string[] = [];
  verificationMessage = '';
  saving = false;

  constructor(
    private profileService: ProfileService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadFavorites();
    this.loadVerification();
  }

  private loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data;
        this.editProfile = { ...this.profile };
      },
      error: () => this.toast.show('Failed to load profile', 'error')
    });
  }

  private loadFavorites(): void {
    this.profileService.getFavorites().subscribe({
      next: (res) => this.favorites = res.data || []
    });
  }

  private loadVerification(): void {
    this.profileService.getVerificationSummary().subscribe({
      next: (res) => this.verificationMessage = res.data?.message || ''
    });
  }

  onSave(): void {
    this.saving = true;
    this.profileService.updateProfile(this.editProfile).subscribe({
      next: () => {
        this.toast.show('Profile updated successfully', 'success');
        this.saving = false;
        this.loadProfile();
      },
      error: (err) => {
        this.toast.show(err.message || 'Failed to update profile', 'error');
        this.saving = false;
      }
    });
  }
}
