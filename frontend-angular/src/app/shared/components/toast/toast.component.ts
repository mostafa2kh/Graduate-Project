import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (visible) {
      <div class="toast-overlay">
        <div class="toast" [class]="type">
          <div class="toast-icon">
            @if (type === 'success') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            }
            @if (type === 'error') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            }
            @if (type === 'warning') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            }
          </div>
          <div class="toast-content">
            <p class="toast-message">{{ message }}</p>
          </div>
          <button class="toast-close" (click)="visible = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .toast-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05);
      max-width: 400px;
      min-width: 300px;
    }

    .toast.success {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: #166534;
    }

    .toast.error {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: #991B1B;
    }

    .toast.warning {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      color: #92400E;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .toast-content {
      flex: 1;
    }

    .toast-message {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
      margin: 0;
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      opacity: 0.6;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  `]
})
export class ToastComponent {
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  @Input() message = '';
  visible = true;
}
