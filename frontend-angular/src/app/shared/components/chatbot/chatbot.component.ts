import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="chatbot-container">
      <button class="chatbot-toggle" (click)="toggle()" [class.active]="open">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      @if (open) {
        <div class="chatbot-panel">
          <div class="chatbot-header">
            <span class="chatbot-title">AI Assistant</span>
            <button class="chatbot-close" (click)="toggle()">&times;</button>
          </div>

          <div class="chatbot-messages" #messagesContainer>
            @for (msg of messages; track msg.timestamp) {
              <div class="message" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
                <div class="message-content">{{ msg.content }}</div>
                <div class="message-time">{{ msg.timestamp | date:'shortTime' }}</div>
              </div>
            }
            @if (loading) {
              <div class="message assistant">
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            }
          </div>

          <div class="chatbot-input">
            <input type="text" [(ngModel)]="input" (keyup.enter)="send()" placeholder="Type a message..."
                   [disabled]="loading" class="chatbot-input-field">
            <button class="chatbot-send" (click)="send()" [disabled]="!input.trim() || loading">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .chatbot-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Inter', sans-serif;
    }

    .chatbot-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: $primary;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba($primary, 0.4);
      transition: all 0.2s;

      &:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba($primary, 0.5); }
      &.active { background: #dc2626; }

      svg { fill: none; }
    }

    .chatbot-panel {
      position: absolute;
      bottom: 68px;
      right: 0;
      width: 360px;
      height: 520px;
      background: $card-light;
      border-radius: $radius-lg;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid $card-border;
    }

    .chatbot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-3 $space-4;
      background: $primary;
      color: white;
    }

    .chatbot-title { font-weight: 600; font-size: $text-sm; }
    .chatbot-close { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: $space-3;
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }

    .message {
      max-width: 80%;
      padding: $space-2 $space-3;
      border-radius: $radius-md;
      font-size: $text-sm;
      line-height: 1.5;

      &.user {
        align-self: flex-end;
        background: $primary;
        color: white;
        border-bottom-right-radius: 4px;
      }

      &.assistant {
        align-self: flex-start;
        background: $bg-light;
        color: $text-dark;
        border-bottom-left-radius: 4px;
      }
    }

    .message-content { white-space: pre-wrap; }
    .message-time { font-size: 10px; opacity: 0.7; margin-top: 4px; }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 4px 0;

      span {
        width: 8px; height: 8px; border-radius: 50%;
        background: $text-muted;
        animation: bounce 1.4s infinite ease-in-out both;

        &:nth-child(1) { animation-delay: -0.32s; }
        &:nth-child(2) { animation-delay: -0.16s; }
      }
    }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .chatbot-input {
      display: flex;
      padding: $space-2 $space-3;
      border-top: 1px solid $card-border;
      gap: $space-2;
    }

    .chatbot-input-field {
      flex: 1;
      border: 1px solid $card-border;
      border-radius: $radius-md;
      padding: $space-2 $space-3;
      font-size: $text-sm;
      outline: none;
      font-family: inherit;

      &:focus { border-color: $primary; }
    }

    .chatbot-send {
      width: 40px; height: 40px;
      border-radius: $radius-md;
      background: $primary;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class ChatbotComponent {
  open = false;
  input = '';
  loading = false;
  messages: Array<{ role: string; content: string; timestamp: Date }> = [];

  constructor(
    private chatbotService: ChatbotService,
    private tokenStorage: TokenStorageService
  ) {}

  toggle() {
    this.open = !this.open;
    if (!this.open && this.messages.length > 0) {
      this.messages = [];
    }
  }

  send() {
    const msg = this.input.trim();
    if (!msg || this.loading) return;
    this.input = '';
    this.messages.push({ role: 'user', content: msg, timestamp: new Date() });
    this.loading = true;
    this.scrollBottom();

    this.chatbotService.sendMessage(msg).subscribe({
      next: (res: any) => {
        this.messages.push({ role: 'assistant', content: res.data.reply, timestamp: new Date() });
        this.loading = false;
        this.scrollBottom();
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() });
        this.loading = false;
        this.scrollBottom();
      }
    });
  }

  private scrollBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chatbot-messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
