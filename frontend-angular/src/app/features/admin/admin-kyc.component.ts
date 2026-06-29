import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-kyc',
  standalone: true,
  imports: [RouterLink, DatePipe, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="admin-kyc">
      <div class="page-header">
        <h1 class="page-title">KYC Reviews</h1>
        <p class="page-subtitle">Review identity verification submissions</p>
      </div>

      @if (loading) { <app-skeleton type="table-row" /> }
      @else if (submissions.length === 0) { <app-empty-state icon="default" title="No Pending KYC" message="All KYC submissions have been reviewed." /> }
      @else {
        <div class="table-wrapper">
          <table class="admin-table">
            <thead><tr><th>User ID</th><th>Type</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
            <tbody>
              @for (s of submissions; track s.id) {
                <tr>
                  <td class="text-muted">{{ s.userId }}</td>
                  <td>{{ s.submissionType }}</td>
                  <td><app-badge variant="warning">{{ s.status }}</app-badge></td>
                  <td class="text-muted">{{ s.submittedAt | date:'medium' }}</td>
                  <td><a [routerLink]="['/admin/kyc', s.id]" class="btn-outline btn-sm">Review</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;
    .page-header { margin-bottom: $space-6; }
    .page-title { font-size: $text-2xl; font-weight: 800; }
    .page-subtitle { font-size: $text-sm; color: $text-muted; margin-top: $space-1; }
    .table-wrapper { background: $card-light; border-radius: $radius-lg; border: 1px solid $card-border; overflow-x: auto; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { padding: $space-3 $space-4; text-align: left; font-size: $text-sm; border-bottom: 1px solid $card-border; white-space: nowrap; }
    .admin-table th { font-weight: 600; color: $text-muted; text-transform: uppercase; font-size: $text-xs; background: $bg-light; }
    .admin-table tr:last-child td { border-bottom: none; }
    .admin-table tr:hover td { background: $bg-light; }
    .text-muted { color: $text-muted; }
  `]
})
export class AdminKycComponent implements OnInit {
  submissions: any[] = []; loading = true;
  constructor(private admin: AdminService) {}
  ngOnInit(): void {
    this.admin.getKycSubmissions().subscribe({
      next: (res: any) => { this.submissions = res.data || res; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
