import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open) {
      <div class="modal-overlay" (click)="dismissOnOverlay && close.emit()">
        <div class="modal-container" [class.modal-sm]="size === 'sm'" [class.modal-lg]="size === 'lg'" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" (click)="close.emit()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
          @if (showFooter) {
            <div class="modal-footer">
              <button class="btn-outline" (click)="close.emit()">{{ cancelText }}</button>
              <button class="btn-primary" (click)="confirm.emit()">{{ confirmText }}</button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    @use 'index' as *;

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      animation: fadeIn 150ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      background: $card-light;
      border-radius: $radius-xl;
      box-shadow: $shadow-xl;
      width: 100%;
      max-width: 520px;
      max-height: 85vh;
      overflow-y: auto;
      animation: slideUp 200ms ease;

      &.modal-sm { max-width: 400px; }
      &.modal-lg { max-width: 700px; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-5 $space-6;
      border-bottom: 1px solid $card-border;
    }

    .modal-title {
      font-size: $text-lg;
      font-weight: 700;
    }

    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: $space-1;
      border-radius: $radius-md;
      color: $text-muted;
      transition: all $transition-base;

      &:hover {
        background: $bg-gray;
        color: $text-dark;
      }

      svg { width: 20px; height: 20px; }
    }

    .modal-body {
      padding: $space-6;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: $space-3;
      padding: $space-4 $space-6;
      border-top: 1px solid $card-border;
    }
  `]
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showFooter = true;
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() dismissOnOverlay = true;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
