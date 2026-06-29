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
            <h1>Create account</h1>
            <p>Join RentSphere and find your rental home</p>
          </div>

          <form (ngSubmit)="onSubmit()">
            @if (error) {
              <div class="alert"><span>{{ error }}</span></div>
            }

            <div class="row">
              <div class="field">
                <label for="fullName">Full name</label>
                <input id="fullName" type="text" placeholder="John Doe" [(ngModel)]="fullName" name="fullName" required />
              </div>
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" [(ngModel)]="email" name="email" required autocomplete="email" />
            </div>

            <div class="field">
              <label for="phone">Phone</label>
              <input id="phone" type="tel" placeholder="+1 (555) 123-4567" [(ngModel)]="phone" name="phone" />
            </div>

            <div class="row">
              <div class="field">
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Create a password" [(ngModel)]="password" name="password" required minlength="8" autocomplete="new-password" />
              </div>
              <div class="field">
                <label for="confirmPassword">Confirm</label>
                <input id="confirmPassword" type="password" placeholder="Confirm password" [(ngModel)]="confirmPassword" name="confirmPassword" required minlength="8" autocomplete="new-password" />
              </div>
            </div>

            <div class="field">
              <label>I want to</label>
              <div class="role-options">
                <button type="button" class="role-btn" [class.active]="role === 'renter'" (click)="role = 'renter'">
                  <span class="role-label">Rent a home</span>
                  <span class="role-desc">I'm looking for a place</span>
                </button>
                <button type="button" class="role-btn" [class.active]="role === 'landlord'" (click)="role = 'landlord'">
                  <span class="role-label">List a property</span>
                  <span class="role-desc">I want to rent out</span>
                </button>
              </div>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading">
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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

    .auth-container { width: 100%; max-width: 500px; }

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

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

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

    .role-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .role-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 20px 16px;
      border: 2px solid rgba(13, 13, 13, 0.1);
      border-radius: 12px;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .role-btn:hover { border-color: #FB6E44; }
    .role-btn.active { border-color: #FB6E44; background: #FFF0EB; }

    .role-label { font-size: 0.9375rem; font-weight: 700; color: #0D0D0D; }
    .role-desc { font-size: 0.75rem; color: #676767; }

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

    @media (max-width: 500px) { .row { grid-template-columns: 1fr; } }
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
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) { this.error = 'Please fill in all required fields'; return; }
    if (this.password !== this.confirmPassword) { this.error = 'Passwords do not match'; return; }
    if (this.password.length < 8) { this.error = 'Password must be at least 8 characters'; return; }
    this.loading = true;
    this.error = '';
    this.authService.register({
      email: this.email, password: this.password, fullName: this.fullName, phone: this.phone, role: this.role
    }).subscribe({
      next: () => { this.toast.show('Account created successfully!', 'success'); this.router.navigateByUrl(this.authService.getDefaultRedirectUrl()); },
      error: (err) => { this.error = err.message || 'Registration failed.'; this.loading = false; }
    });
  }
}
