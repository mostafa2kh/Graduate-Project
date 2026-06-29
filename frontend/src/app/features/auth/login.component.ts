import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
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
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Sign in to your account to continue</p>
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
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                class="input-field"
                placeholder="Enter your password"
                [(ngModel)]="password"
                required
                minlength="6"
                autocomplete="current-password"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary btn-lg btn-full" [disabled]="loading">
                @if (loading) {
                  <span class="spinner"></span>
                }
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register" class="auth-link">Create one</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $bg-dark;
      padding: $space-6;
    }

    .auth-container {
      width: 100%;
      max-width: 440px;
    }

    .auth-card {
      background: $card-light;
      border-radius: 24px;
      box-shadow: 0 24px 80px rgba(#000, 0.4);
      overflow: hidden;
    }

    .auth-header {
      text-align: center;
      padding: $space-10 $space-8 $space-6;
    }

    .auth-logo {
      display: inline-flex;
      align-items: center;
      gap: $space-3;
      font-size: $text-xl;
      font-weight: 950;
      color: $text-dark;
      text-decoration: none;
      margin-bottom: $space-6;
      letter-spacing: -0.05em;

      .logo-icon {
        width: 28px;
        height: 28px;
        color: $secondary-dark;
      }
    }

    .auth-title {
      font-size: $text-3xl;
      font-weight: 950;
      color: $text-dark;
      margin-bottom: $space-2;
      letter-spacing: -0.04em;
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }

    .form-group label {
      font-size: $text-xs;
      font-weight: 900;
      color: $text-dark;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .form-group input {
      width: 100%;
      padding: $space-3 $space-4;
      border: 1.5px solid $card-border;
      border-radius: 14px;
      font-family: $font-family;
      font-size: $text-sm;
      font-weight: 700;
      color: $text-dark;
      background: $card-light;
      transition: border-color $transition-base, box-shadow $transition-base;
      outline: none;

      &:focus {
        border-color: $secondary-dark;
        box-shadow: 0 0 0 3px rgba($secondary-dark, 0.12);
      }

      &::placeholder {
        color: $text-light;
      }
    }

    .btn-full {
      width: 100%;
      justify-content: center;
    }

    .btn-full.btn-primary {
      padding: $space-4;
      border-radius: 14px;
      font-size: $text-sm;
      font-weight: 900;
      background: $primary;
      color: $text-white;
      border: none;
      box-shadow: none;

      &:hover:not(:disabled) {
        background: $primary-light;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
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
      border-radius: 14px;
      font-size: $text-sm;
      font-weight: 500;
    }

    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid rgba(#dc2626, 0.15);
    }

    .alert-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
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
      color: $secondary-dark;
      text-decoration: none;
      font-weight: 900;

      &:hover {
        text-decoration: underline;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.toast.show('Welcome back!', 'success');
        this.router.navigateByUrl(this.getRedirectUrl());
      },
      error: (err) => {
        this.error = err.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  private getRedirectUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    return this.authService.getDefaultRedirectUrl();
  }
}
