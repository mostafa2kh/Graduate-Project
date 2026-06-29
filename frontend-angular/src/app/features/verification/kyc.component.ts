import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { VerificationService } from '../../core/services/verification.service';
import { ToastService } from '../../shared/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, BadgeComponent, NgClass],
  template: `
    <div class="kyc-page">
      <div class="page-header">
        <h1 class="page-title">Identity Verification (KYC)</h1>
        <p class="page-subtitle">Verify your identity to build trust on RentSphere</p>
      </div>

      <!-- Status Banner -->
      <div class="status-banner" [class]="'status-' + (status.toLowerCase() || 'unverified')">
        <div class="status-icon">
          @switch (status) {
            @case ('VERIFIED') { <span>&#10003;</span> }
            @case ('PENDING') { <span>&#8987;</span> }
            @case ('REJECTED') { <span>&#10007;</span> }
            @default { <span>&#9888;</span> }
          }
        </div>
        <div class="status-content">
          <h3 class="status-title">
            @switch (status) {
              @case ('VERIFIED') { Verified }
              @case ('PENDING') { Pending Review }
              @case ('REJECTED') { Rejected }
              @default { Not Verified }
            }
          </h3>
          <p class="status-desc">
            @switch (status) {
              @case ('VERIFIED') { Your identity has been verified. You can now list properties and book with confidence. }
              @case ('PENDING') { Your documents are being reviewed by our team. We'll notify you once the review is complete. }
              @case ('REJECTED') { Your submission was rejected. Please review the reason and resubmit with corrected documents. }
              @default { Verify your identity to unlock full features on RentSphere. }
            }
          </p>
          @if (status === 'PENDING') {
            <span class="auto-refresh-badge" [class.active]="polling">Auto-refreshing every 10s</span>
          }
        </div>
      </div>

      <!-- Timeline -->
      @if (submissions.length > 0) {
        <div class="card timeline-card">
          <div class="card-header"><h3>Verification Timeline</h3></div>
          <div class="timeline">
            @for (sub of submissions; track sub.id; let i = $index) {
              <div class="timeline-item" [class.active]="i === 0">
                <div class="timeline-marker" [class]="'marker-' + (sub.status?.toLowerCase() || 'pending')"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <app-badge [variant]="sub.status === 'VERIFIED' ? 'success' : (sub.status === 'REJECTED' ? 'danger' : 'warning')">{{ sub.status }}</app-badge>
                    <span class="timeline-date">{{ sub.submittedAt | date:'medium' }}</span>
                  </div>
                  @if (sub.submissionType) {
                    <p class="timeline-type">Type: {{ sub.submissionType }}</p>
                  }
                  @if (sub.decisions?.length > 0) {
                    @for (d of sub.decisions; track d.id) {
                      <div class="timeline-decision">
                        <span class="decision-label">{{ d.decision === 'APPROVED' ? 'Approved' : 'Rejected' }}</span>
                        @if (d.reason) { <p class="decision-reason">{{ d.reason }}</p> }
                        <span class="decision-date">{{ d.createdAt | date:'short' }}</span>
                      </div>
                    }
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Submit / Resubmit Form -->
      @if (status !== 'VERIFIED') {
        <div class="card form-card">
          <div class="card-header">
            <h3>{{ status === 'REJECTED' ? 'Resubmit KYC' : 'Submit KYC' }}</h3>
            @if (status === 'REJECTED') {
              <span class="resubmit-hint">Correct the issues and resubmit</span>
            }
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group">
                <label>Submission Type</label>
                <select class="input-field" [(ngModel)]="form.submissionType">
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Notes (optional)</label>
              <textarea class="input-field" rows="3" [(ngModel)]="form.notes" placeholder="Any additional information about your identity documents"></textarea>
            </div>

            <!-- Document Upload -->
            <div class="form-group">
              <label>Upload Documents</label>
              <div class="upload-zone"
                   (dragover)="onDragOver($event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onDrop($event)"
                   [class.dragover]="dragOver"
                   (click)="fileInput.click()">
                <input #fileInput type="file" multiple hidden (change)="onFileSelected($event)" accept=".jpg,.jpeg,.png,.pdf">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                </div>
                <p class="upload-text">Drag & drop documents here or <span class="upload-link">browse</span></p>
                <p class="upload-hint">Accepted: JPEG, PNG, PDF &mdash; Max 10MB per file</p>
              </div>
              @if (selectedFiles.length > 0) {
                <div class="file-list">
                  @for (f of selectedFiles; track f.name) {
                    <div class="file-item">
                      <div class="file-info">
                        <span class="file-type-badge">{{ getFileIcon(f.name) }}</span>
                        <div>
                          <span class="file-name">{{ f.name }}</span>
                          <span class="file-size">{{ (f.size / 1024 / 1024).toFixed(1) }} MB</span>
                        </div>
                      </div>
                      <button class="file-remove" (click)="removeFile(f)">&times;</button>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Document Type for Upload -->
            @if (activeSubmissionId && status === 'PENDING') {
              <div class="form-group">
                <label>Add Document to Pending Submission</label>
                <div class="inline-upload">
                  <select class="input-field" [(ngModel)]="uploadDocType">
                    <option value="NATIONAL_ID">National ID</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVERS_LICENSE">Driver's License</option>
                    <option value="PROOF_OF_ADDRESS">Proof of Address</option>
                  </select>
                  <input #addFileInput type="file" hidden (change)="uploadSingleDocument($event)" accept=".jpg,.jpeg,.png,.pdf">
                  <button class="btn-outline" (click)="addFileInput.click()" [disabled]="docUploading">
                    {{ docUploading ? 'Uploading...' : 'Upload Document' }}
                  </button>
                </div>
              </div>
            }

            <button class="btn-primary btn-lg" (click)="onSubmit()" [disabled]="submitting || selectedFiles.length === 0">
              {{ submitting ? 'Submitting...' : (status === 'REJECTED' ? 'Resubmit KYC' : 'Submit KYC') }}
            </button>
          </div>
        </div>
      }

      <!-- Document List for Current/Pending Submissions -->
      @if (currentSubmissionDocuments.length > 0) {
        <div class="card">
          <div class="card-header"><h3>Uploaded Documents</h3></div>
          <div class="card-body">
            <div class="doc-grid">
              @for (doc of currentSubmissionDocuments; track doc.id) {
                <div class="doc-card">
                  <div class="doc-preview">
                    @if (doc.contentType?.startsWith('image/')) {
                      <img [src]="'data:' + doc.contentType + ';base64,'" alt="" class="doc-img" />
                    } @else {
                      <div class="doc-pdf-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                    }
                  </div>
                  <div class="doc-info">
                    <span class="doc-name">{{ doc.fileName }}</span>
                    <span class="doc-type">{{ doc.documentType }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .kyc-page {
      max-width: 800px;
      margin: 0 auto;
      padding: $space-6 0;
    }

    .page-header {
      margin-bottom: $space-8;
    }

    .page-title {
      font-size: $text-2xl;
      font-weight: 800;
      margin-bottom: $space-1;
    }

    .page-subtitle {
      color: $text-muted;
      font-size: $text-sm;
    }

    .status-banner {
      display: flex;
      gap: $space-4;
      padding: $space-6;
      border-radius: $radius-lg;
      margin-bottom: $space-6;
      align-items: flex-start;

      &.status-verified {
        background: #F0FDF4;
        border: 1px solid #BBF7D0;
        .status-icon { background: #22C55E; color: white; }
        .status-title { color: #166534; }
        .status-desc { color: #15803D; }
      }

      &.status-pending {
        background: #FFFBEB;
        border: 1px solid #FDE68A;
        .status-icon { background: #F59E0B; color: white; }
        .status-title { color: #92400E; }
        .status-desc { color: #B45309; }
      }

      &.status-rejected {
        background: #FEF2F2;
        border: 1px solid #FECACA;
        .status-icon { background: #EF4444; color: white; }
        .status-title { color: #991B1B; }
        .status-desc { color: #B91C1C; }
      }

      &.status-unverified {
        background: $bg-gray;
        border: 1px solid $card-border;
        .status-icon { background: $text-muted; color: white; }
        .status-title { color: $text-dark; }
        .status-desc { color: $text-muted; }
      }
    }

    .status-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .status-content {
      flex: 1;
    }

    .status-title {
      font-size: $text-base;
      font-weight: 700;
      margin-bottom: $space-1;
    }

    .status-desc {
      font-size: $text-sm;
      line-height: 1.5;
      margin: 0;
    }

    .auto-refresh-badge {
      display: inline-block;
      font-size: $text-xs;
      font-weight: 600;
      color: #92400E;
      background: #FDE68A;
      padding: 2px 10px;
      border-radius: 999px;
      margin-top: $space-2;
      animation: pulse 2s infinite;

      &.active::after {
        content: '●';
        animation: blink 1s infinite;
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .card {
      background: $card-light;
      border: 1px solid $card-border;
      border-radius: $radius-lg;
      margin-bottom: $space-6;
      overflow: hidden;
    }

    .card-header {
      padding: $space-5 $space-6;
      border-bottom: 1px solid $card-border;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: $text-base;
        font-weight: 700;
        margin: 0;
      }
    }

    .card-body {
      padding: $space-6;
    }

    .resubmit-hint {
      font-size: $text-xs;
      color: $primary;
      font-weight: 500;
    }

    .form-row {
      margin-bottom: $space-4;
    }

    .form-group {
      margin-bottom: $space-5;

      label {
        display: block;
        font-size: $text-sm;
        font-weight: 600;
        color: $text-dark;
        margin-bottom: $space-2;
      }
    }

    .upload-zone {
      border: 2px dashed $card-border;
      border-radius: $radius-lg;
      padding: $space-10;
      text-align: center;
      cursor: pointer;
      transition: all $transition-base;

      &:hover, &.dragover {
        border-color: $primary;
        background: $primary-bg;
      }
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto $space-4;
      color: $text-muted;

      svg { width: 100%; height: 100%; }
    }

    .upload-text {
      font-size: $text-sm;
      color: $text-dark;
      margin-bottom: $space-1;
    }

    .upload-link {
      color: $primary;
      font-weight: 600;
    }

    .upload-hint {
      font-size: $text-xs;
      color: $text-muted;
    }

    .file-list {
      margin-top: $space-4;
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $space-3;
      background: $bg-light;
      border-radius: $radius-md;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: $space-3;
    }

    .file-type-badge {
      width: 32px;
      height: 32px;
      border-radius: $radius-sm;
      background: $primary-bg;
      color: $primary;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $text-xs;
      font-weight: 700;
    }

    .file-name {
      font-size: $text-sm;
      font-weight: 500;
    }

    .file-size {
      font-size: $text-xs;
      color: $text-muted;
      margin-left: $space-2;
    }

    .file-remove {
      background: none;
      border: none;
      color: $text-muted;
      font-size: $text-lg;
      cursor: pointer;
      padding: $space-1;

      &:hover { color: #EF4444; }
    }

    .inline-upload {
      display: flex;
      gap: $space-3;
      align-items: center;

      select { flex: 1; }
    }

    .timeline-card {
      .card-body { padding: 0; }
    }

    .timeline {
      padding: $space-6;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .timeline-item {
      display: flex;
      gap: $space-4;
      position: relative;
      padding-bottom: $space-6;

      &:last-child { padding-bottom: 0; }

      &::before {
        content: '';
        position: absolute;
        left: 11px;
        top: 28px;
        bottom: 0;
        width: 2px;
        background: $card-border;
      }

      &:last-child::before { display: none; }
    }

    .timeline-marker {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      border: 3px solid $card-border;
      background: $card-light;

      &.marker-verified { border-color: #22C55E; background: #F0FDF4; }
      &.marker-rejected { border-color: #EF4444; background: #FEF2F2; }
      &.marker-pending { border-color: #F59E0B; background: #FFFBEB; }
    }

    .timeline-content {
      flex: 1;
    }

    .timeline-header {
      display: flex;
      gap: $space-3;
      align-items: center;
      margin-bottom: $space-1;
    }

    .timeline-date {
      font-size: $text-xs;
      color: $text-muted;
    }

    .timeline-type {
      font-size: $text-sm;
      color: $text-muted;
      margin: $space-1 0;
    }

    .timeline-decision {
      margin-top: $space-2;
      padding: $space-2 $space-3;
      background: $bg-light;
      border-radius: $radius-md;
    }

    .decision-label {
      font-size: $text-xs;
      font-weight: 700;
      text-transform: uppercase;
      color: $text-muted;
    }

    .decision-reason {
      font-size: $text-sm;
      margin: $space-1 0;
      color: $text-dark;
    }

    .decision-date {
      font-size: $text-xs;
      color: $text-muted;
    }

    .doc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: $space-4;
    }

    .doc-card {
      border: 1px solid $card-border;
      border-radius: $radius-md;
      overflow: hidden;
    }

    .doc-preview {
      height: 120px;
      background: $bg-light;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .doc-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .doc-pdf-icon {
      width: 40px;
      height: 40px;
      color: #EF4444;

      svg { width: 100%; height: 100%; }
    }

    .doc-info {
      padding: $space-2 $space-3;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .doc-name {
      font-size: $text-xs;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .doc-type {
      font-size: $text-xs;
      color: $text-muted;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      background: $primary;
      color: white;
      border: none;
      padding: $space-3 $space-6;
      border-radius: $radius-md;
      font-weight: 600;
      font-size: $text-sm;
      cursor: pointer;
      transition: background $transition-base;

      &:hover { background: darken($primary, 10%); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }

      &.btn-lg { padding: $space-3 $space-8; }
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      background: transparent;
      color: $text-dark;
      border: 1px solid $card-border;
      padding: $space-2 $space-4;
      border-radius: $radius-md;
      font-weight: 500;
      font-size: $text-sm;
      cursor: pointer;
      transition: all $transition-base;

      &:hover { background: $bg-light; border-color: $text-muted; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class KycComponent implements OnInit, OnDestroy {
  status = '';
  activeSubmissionId = '';
  submissions: any[] = [];
  currentSubmissionDocuments: any[] = [];
  submitting = false;
  docUploading = false;
  dragOver = false;
  polling = false;
  selectedFiles: File[] = [];
  uploadDocType = 'NATIONAL_ID';
  private pollSub?: Subscription;

  form: any = { submissionType: 'INDIVIDUAL', notes: '' };

  constructor(
    private verificationService: VerificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private loadData(): void {
    this.verificationService.getStatus().subscribe({
      next: (res: any) => {
        const d = res.data || res;
        this.status = d.status;
        this.activeSubmissionId = d.latestSubmissionId;
        if (this.status === 'PENDING') {
          this.startPolling();
        } else {
          this.stopPolling();
        }
      },
      error: () => { this.status = 'UNVERIFIED'; }
    });

    this.verificationService.getMySubmissions().subscribe({
      next: (res: any) => {
        this.submissions = res.data || res || [];
        const latest = this.submissions[0];
        if (latest) {
          this.currentSubmissionDocuments = latest.documents || [];
        }
      },
      error: () => {}
    });
  }

  private startPolling(): void {
    if (this.pollSub) return;
    this.polling = true;
    this.pollSub = interval(10000).subscribe(() => {
      this.verificationService.getStatus().subscribe({
        next: (res: any) => {
          const d = res.data || res;
          if (d.status !== 'PENDING') {
            this.status = d.status;
            this.stopPolling();
            this.loadData();
            if (d.status === 'VERIFIED') {
              this.toast.show('Your KYC has been approved!', 'success');
            }
          }
        }
      });
    });
  }

  private stopPolling(): void {
    this.polling = false;
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
  }

  getFileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['jpg', 'jpeg'].includes(ext || '')) return 'JPG';
    if (ext === 'png') return 'PNG';
    return 'DOC';
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.dragOver = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver = false;
    const files = Array.from(e.dataTransfer?.files || []);
    this.addFiles(files);
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
    input.value = '';
  }

  private addFiles(files: File[]): void {
    const validFiles = files.filter(f => {
      const type = f.type;
      const size = f.size;
      return (type.startsWith('image/') || type === 'application/pdf') && size <= 10 * 1024 * 1024;
    });
    if (validFiles.length !== files.length) {
      this.toast.show('Some files were skipped (invalid type or >10MB)', 'warning');
    }
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onSubmit(): void {
    if (this.selectedFiles.length === 0) {
      this.toast.show('Please upload at least one document', 'warning');
      return;
    }
    this.submitting = true;
    this.verificationService.submitKyc(this.form).subscribe({
      next: (res: any) => {
        const submission = res.data || res;
        this.toast.show('KYC submitted successfully', 'success');
        // Upload documents
        this.uploadAllDocuments(submission.id);
      },
      error: (err) => {
        this.toast.show(err.message || 'Failed to submit', 'error');
        this.submitting = false;
      }
    });
  }

  private uploadAllDocuments(submissionId: string): void {
    let uploaded = 0;
    const total = this.selectedFiles.length;
    for (const file of this.selectedFiles) {
      this.verificationService.uploadDocument(submissionId, file, this.form.submissionType || 'NATIONAL_ID').subscribe({
        next: () => {
          uploaded++;
          if (uploaded === total) {
            this.submitting = false;
            this.selectedFiles = [];
            this.loadData();
          }
        },
        error: () => {
          uploaded++;
          if (uploaded === total) {
            this.submitting = false;
            this.loadData();
          }
        }
      });
    }
  }

  uploadSingleDocument(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!this.activeSubmissionId) {
      this.toast.show('No active submission', 'warning');
      return;
    }
    this.docUploading = true;
    this.verificationService.uploadDocument(this.activeSubmissionId, file, this.uploadDocType).subscribe({
      next: () => {
        this.toast.show('Document uploaded', 'success');
        this.docUploading = false;
        this.loadData();
      },
      error: (err) => {
        this.toast.show(err.message || 'Upload failed', 'error');
        this.docUploading = false;
      }
    });
    input.value = '';
  }
}
