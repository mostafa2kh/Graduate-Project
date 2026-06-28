import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <a routerLink="/" class="auth-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="logo-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              RentSphere
            </a>
            <h1 class="auth-title">Create Account</h1>
            <p class="auth-subtitle">Join RentSphere and find your perfect rental home</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            @if (error) {
              <div class="alert alert-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{{ error }}</span>
              </div>
            }

            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  class="input-field"
                  placeholder="John Doe"
                  [(ngModel)]="fullName"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                class="input-field"
                placeholder="you@example.com"
                [(ngModel)]="email"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                class="input-field"
                placeholder="+1 (555) 123-4567"
                [(ngModel)]="phone"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  class="input-field"
                  placeholder="Create a password"
                  [(ngModel)]="password"
                  required
                  minlength="6"
                  autocomplete="new-password"
                />
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  class="input-field"
                  placeholder="Confirm your password"
                  [(ngModel)]="confirmPassword"
                  required
                  minlength="6"
                  autocomplete="new-password"
                />
              </div>
            </div>

            <div class="form-group">
              <label>I want to</label>
              <div class="role-selector">
                <button
                  type="button"
                  class="role-option"
                  [class.active]="role === 'renter'"
                  (click)="role = 'renter'"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="role-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <span class="role-label">Rent a Home</span>
                  <span class="role-desc">I'm looking for a place to rent</span>
                </button>
                <button
                  type="button"
                  class="role-option"
                  [class.active]="role === 'landlord'"
                  (click)="role = 'landlord'"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="role-icon">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span class="role-label">List a Property</span>
                  <span class="role-desc">I want to rent out my property</span>
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary btn-lg btn-full" [disabled]="loading">
                @if (loading) {
                  <span class="spinner"></span>
                }
                {{ loading ? 'Creating account...' : 'Create Account' }}
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login" class="auth-link">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .auth-page {
      min-height: calc(100vh - $navbar-height);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, $primary-bg 0%, $secondary-bg 50%, $accent-bg 100%);
      padding: $space-6;
    }

    .auth-container {
      width: 100%;
      max-width: 520px;
    }

    .auth-card {
      background: $card-light;
      border-radius: $radius-xl;
      box-shadow: $shadow-xl;
      overflow: hidden;
    }

    .auth-header {
      text-align: center;
      padding: $space-10 $space-8 $space-6;
    }

    .auth-logo {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      font-size: $text-xl;
      font-weight: 800;
      color: $primary;
      text-decoration: none;
      margin-bottom: $space-6;

      .logo-icon {
        width: 28px;
        height: 28px;
        color: $primary;
      }
    }

    .auth-title {
      font-size: $text-3xl;
      font-weight: 800;
      color: $text-dark;
      margin-bottom: $space-2;
    }

    .auth-subtitle {
      font-size: $text-sm;
      color: $text-muted;
    }

    .auth-form {
      padding: 0 $space-8 $space-8;
      display: flex;
      flex-direction: column;
      gap: $space-5;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-4;

      @include sm {
        grid-template-columns: 1fr;
      }
    }

    .btn-full {
      width: 100%;
      justify-content: center;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba($text-white, 0.3);
      border-top-color: $text-white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-3 $space-4;
      border-radius: $radius-md;
      font-size: $text-sm;
      font-weight: 500;
    }

    .alert-error {
      background: $danger-bg;
      color: $danger;
      border: 1px solid rgba($danger, 0.2);
    }

    .alert-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .role-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-3;
    }

    .role-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-2;
      padding: $space-5 $space-4;
      border: 2px solid $card-border;
      border-radius: $radius-lg;
      background: $card-light;
      cursor: pointer;
      transition: all $transition-base;
      text-align: center;

      &:hover {
        border-color: $primary-light;
        background: $primary-bg;
      }

      &.active {
        border-color: $primary;
        background: $primary-bg;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }

      .role-icon {
        width: 28px;
        height: 28px;
        color: $primary;
      }

      .role-label {
        font-size: $text-sm;
        font-weight: 700;
        color: $text-dark;
      }

      .role-desc {
        font-size: $text-xs;
        color: $text-muted;
        line-height: 1.4;
      }
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: $space-4;
    }

    .auth-footer {
      text-align: center;
      padding: $space-6 $space-8;
      border-top: 1px solid $card-border;
      font-size: $text-sm;
      color: $text-muted;
    }

    .auth-link {
      color: $primary;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  `]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  role = 'renter';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onSubmit(): void {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register({
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      phone: this.phone,
      role: this.role
    }).subscribe({
      next: () => {
        this.toast.show('Account created successfully!', 'success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
