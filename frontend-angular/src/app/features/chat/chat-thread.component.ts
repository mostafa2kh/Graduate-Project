import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-chat-thread',
  standalone: true,
  imports: [DatePipe, SlicePipe, FormsModule],
  template: `
    <div class="thread-page">
      <div class="thread-header">
        <button class="btn-back" (click)="goBack()">&larr; Back</button>
        <span class="thread-title">Chat with User {{ otherUserId | slice:0:8 }}...</span>
      </div>

      <div class="messages-area" #messageArea>
        @for (m of messages; track m.id) {
          <div class="message" [class.mine]="m.senderId === myId">
            <div class="message-bubble">
              <p class="message-text">{{ m.content }}</p>
              <span class="message-time">{{ m.createdAt | date:'short' }}</span>
            </div>
          </div>
        } @empty {
          <div class="empty-chat">
            <p>No messages yet. Send a message to start the conversation.</p>
          </div>
        }
      </div>

      <div class="composer">
        <input class="composer-input" placeholder="Type a message..." [(ngModel)]="newMessage" (keyup.enter)="send()" [disabled]="sending" />
        <button class="btn-primary" (click)="send()" [disabled]="!newMessage.trim() || sending">{{ sending ? 'Sending...' : 'Send' }}</button>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .thread-page { display: flex; flex-direction: column; height: calc(100vh - 200px); }
    .thread-header { display: flex; align-items: center; gap: $space-3; padding: $space-4; background: $card-light; border-bottom: 1px solid $card-border; }
    .btn-back { background: none; border: none; font-size: $text-lg; cursor: pointer; color: $primary; }
    .thread-title { font-size: $text-base; font-weight: 600; }
    .messages-area { flex: 1; overflow-y: auto; padding: $space-4; display: flex; flex-direction: column; gap: $space-3; }
    .message { display: flex; &.mine { justify-content: flex-end; } }
    .message-bubble { max-width: 70%; padding: $space-3 $space-4; border-radius: $radius-lg; background: $bg-light; .mine & { background: $primary; color: white; } }
    .message-text { font-size: $text-sm; line-height: 1.5; word-wrap: break-word; }
    .message-time { font-size: $text-xs; opacity: 0.7; display: block; margin-top: $space-1; }
    .empty-chat { text-align: center; padding: $space-12; color: $text-muted; }
    .composer { display: flex; gap: $space-3; padding: $space-4; background: $card-light; border-top: 1px solid $card-border; }
    .composer-input { flex: 1; padding: $space-3 $space-4; border: 1px solid $card-border; border-radius: $radius-full; font-size: $text-sm; outline: none; &:focus { border-color: $primary; } }
  `]
})
export class ChatThreadComponent implements OnInit {
  threadId = ''; myId = ''; otherUserId = '';
  messages: any[] = []; newMessage = ''; sending = false;

  constructor(private route: ActivatedRoute, private router: Router, private chatService: ChatService, private toast: ToastService) {}

  ngOnInit(): void {
    this.threadId = this.route.snapshot.paramMap.get('threadId') || '';
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatService.getMessages(this.threadId).subscribe({
      next: (res: any) => {
        const msgs = res.data || res;
        this.messages = msgs;
        if (msgs.length > 0) this.myId = msgs[0].senderId;
        this.chatService.markAsRead(this.threadId).subscribe();
        this.chatService.getThreadDetail(this.threadId).subscribe((r2: any) => {
          const d = r2.data || r2;
          this.otherUserId = d.otherParticipantId;
        });
      },
      error: () => {}
    });
  }

  send(): void {
    if (!this.newMessage.trim()) return;
    this.sending = true;
    this.chatService.sendMessage(this.threadId, this.newMessage.trim()).subscribe({
      next: (res: any) => {
        this.messages.push(res.data || res);
        this.newMessage = '';
        this.sending = false;
      },
      error: (err) => { this.toast.show(err.message || 'Failed to send', 'error'); this.sending = false; }
    });
  }

  goBack(): void { this.router.navigate(['/dashboard/messages']); }
}
