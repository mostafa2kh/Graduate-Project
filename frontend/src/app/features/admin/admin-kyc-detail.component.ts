import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-kyc-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, BadgeComponent, SkeletonComponent],
  template: `
    <div class="detail-page">
      <a routerLink="/admin/kyc" class="back-link">&larr; Back to KYC List</a>
      @if (loading) { <app-skeleton type="card" /> }
      @else if (submission) {
        <div class="detail-header">
          <h1 class="detail-title">KYC Submission</h1>
          <div class="detail-actions">
            <button class="btn-success" (click)="openApprove()">Approve</button>
            <button class="btn-danger" (click)="openReject()">Reject</button>
          </div>
        </div>
        <div class="detail-grid">
          <div class="card">
            <div class="card-header"><h3>Submission Details</h3></div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item"><span>User ID</span><strong>{{ submission.userId }}</strong></div>
                <div class="info-item"><span>Type</span><strong>{{ submission.submissionType }}</strong></div>
                <div class="info-item"><span>Status</span><app-badge [variant]="submission.status === 'VERIFIED' ? 'success' : 'warning'">{{ submission.status }}</app-badge></div>
                <div class="info-item"><span>Submitted</span><strong>{{ submission.submittedAt | date:'medium' }}</strong></div>
                @if (submission.notes) { <div class="info-item" style="grid-column: 1/-1;"><span>Notes</span><strong>{{ submission.notes }}</strong></div> }
              </div>
            </div>
          </div>
          @if (submission.decisions?.length > 0) {
            <div class="card">
              <div class="card-header"><h3>Decisions</h3></div>
              <div class="card-body">
                @for (d of submission.decisions; track d.id) {
                  <div class="decision-item">
                    <app-badge [variant]="d.decision === 'APPROVED' ? 'success' : 'danger'">{{ d.decision }}</app-badge>
                    @if (d.reason) { <p class="text-muted">{{ d.reason }}</p> }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      @if (showRejectModal) {
        <div class="modal-overlay" (click)="closeModals()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <h3 class="modal-title">Reject KYC</h3>
            <div class="form-group"><label>Reason *</label><textarea class="input-field" rows="3" [(ngModel)]="rejectReason"></textarea></div>
            <div class="modal-actions"><button class="btn-outline" (click)="closeModals()">Cancel</button><button class="btn-primary" (click)="confirmReject()" [disabled]="!rejectReason.trim()">Reject</button></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .back-link { display: inline-block; font-size: $text-sm; color: $primary; text-decoration: none; margin-bottom: $space-6; font-weight: 500; &:hover { text-decoration: underline; } }
    .detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: $space-8; @include sm { flex-direction: column; gap: $space-4; } }
    .detail-title { font-size: $text-2xl; font-weight: 800; }
    .detail-actions { display: flex; gap: $space-3; }
    .detail-grid { display: grid; gap: $space-6; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: $space-4; }
    .info-item { display: flex; flex-direction: column; gap: $space-1; span { font-size: $text-xs; color: $text-muted; text-transform: uppercase; } strong { font-size: $text-base; } }
    .text-muted { color: $text-muted; font-size: $text-sm; }
    .decision-item { display: flex; gap: $space-3; align-items: center; padding: $space-2 0; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { background: $card-light; border-radius: $radius-lg; padding: $space-8; min-width: 400px; max-width: 500px; box-shadow: $shadow-xl; }
    .modal-title { font-size: $text-xl; font-weight: 700; margin-bottom: $space-6; }
    .modal-actions { display: flex; justify-content: flex-end; gap: $space-3; margin-top: $space-6; }
  `]
})
export class AdminKycDetailComponent implements OnInit {
  submissionId = ''; submission: any = null; loading = true;
  showRejectModal = false; rejectReason = '';

  constructor(private route: ActivatedRoute, private admin: AdminService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.submissionId = this.route.snapshot.paramMap.get('submissionId') || '';
    this.admin.getKycSubmissionDetail(this.submissionId).subscribe({
      next: (res: any) => { this.submission = res.data || res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openApprove(): void {
    this.admin.approveKyc(this.submissionId).subscribe({
      next: () => { this.toast.show('KYC approved', 'success'); this.router.navigate(['/admin/kyc']); },
      error: (err) => this.toast.show(err.message || 'Failed', 'error')
    });
  }
  openReject(): void { this.showRejectModal = true; }
  closeModals(): void { this.showRejectModal = false; this.rejectReason = ''; }
  confirmReject(): void {
    if (!this.rejectReason.trim()) return;
    this.admin.rejectKyc(this.submissionId, this.rejectReason).subscribe({
      next: () => { this.toast.show('KYC rejected', 'warning'); this.router.navigate(['/admin/kyc']); },
      error: (err) => this.toast.show(err.message || 'Failed', 'error')
    });
  }
}
