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
            <h1>Welcome back</h1>
            <p>Sign in to your account</p>
          </div>

          <form (ngSubmit)="onSubmit()">
            @if (error) {
              <div class="alert">
                <span>{{ error }}</span>
              </div>
            }

            <div class="field">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" [(ngModel)]="email" name="email" required autocomplete="email" />
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" [(ngModel)]="password" name="password" required minlength="6" autocomplete="current-password" />
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Create one</a></p>
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
      background: #0a0d77;
      padding: 24px;
    }

    .auth-container { width: 100%; max-width: 420px; }

    .auth-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      overflow: hidden;
    }

    .auth-header {
      text-align: center;
      padding: 40px 32px 24px;
    }

    .auth-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 1.25rem;
      font-weight: 800;
      color: #0D0D0D;
      text-decoration: none;
      margin-bottom: 24px;
    }

    .logo-icon { width: 24px; height: 24px; color: #FB6E44; }

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0D0D0D;
      margin-bottom: 6px;
    }

    .auth-header p { color: #676767; font-size: 0.9375rem; }

    form {
      padding: 0 32px 32px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field { display: flex; flex-direction: column; gap: 8px; }

    .field label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #0D0D0D;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .field input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid rgba(13, 13, 13, 0.12);
      border-radius: 10px;
      font-size: 0.9375rem;
      color: #0D0D0D;
      outline: none;
      transition: border-color 0.2s;
    }

    .field input:focus { border-color: #FB6E44; box-shadow: 0 0 0 3px rgba(251, 110, 68, 0.1); }
    .field input::placeholder { color: #c7c7c7; }

    .alert {
      padding: 12px 16px;
      border-radius: 10px;
      background: #fef2f2;
      color: #e34242;
      font-size: 0.875rem;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 10px;
      background: #FB6E44;
      color: #fff;
      font-size: 0.9375rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-submit:hover:not(:disabled) { background: #af4d2f; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    .auth-footer {
      text-align: center;
      padding: 20px 32px;
      border-top: 1px solid rgba(13, 13, 13, 0.08);
      font-size: 0.875rem;
      color: #676767;
    }

    .auth-footer a { color: #FB6E44; font-weight: 700; text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
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
    if (!this.email || !this.password) { this.error = 'Please fill in all fields'; return; }
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => { this.toast.show('Welcome back!', 'success'); this.router.navigateByUrl(this.getRedirectUrl()); },
      error: (err) => { this.error = err.message || 'Invalid email or password'; this.loading = false; }
    });
  }

  private getRedirectUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) return returnUrl;
    return this.authService.getDefaultRedirectUrl();
  }
}
