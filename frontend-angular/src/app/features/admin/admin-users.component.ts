import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="admin-users">
      <div class="page-header">
        <h1 class="page-title">User Management</h1>
        <p class="page-subtitle">View and manage platform users</p>
      </div>

      @if (loading) {
        <app-skeleton type="table-row" />
      } @else if (users.length === 0) {
        <app-empty-state icon="default" title="No Users Found" message="No users registered yet." />
      } @else {
        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Listings</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users; track user.userId) {
                <tr>
                  <td class="name-cell">{{ user.fullName }}</td>
                  <td class="text-muted">{{ user.email }}</td>
                  <td><app-badge [variant]="user.role === 'ROLE_ADMIN' ? 'danger' : (user.role === 'ROLE_LANDLORD' ? 'primary' : 'neutral')">{{ user.role?.replace('ROLE_', '') }}</app-badge></td>
                  <td>{{ user.listingCount }}</td>
                  <td><app-badge [variant]="user.verified ? 'success' : 'warning'">{{ user.verified ? 'Yes' : 'No' }}</app-badge></td>
                  <td><app-badge [variant]="user.enabled ? 'success' : 'danger'">{{ user.enabled ? 'Active' : 'Disabled' }}</app-badge></td>
                  <td class="text-muted">{{ user.createdAt | date:'mediumDate' }}</td>
                  <td>
                    <button class="btn-outline btn-sm" (click)="toggleUser(user)">
                      {{ user.enabled ? 'Disable' : 'Enable' }}
                    </button>
                  </td>
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

    .table-wrapper {
      background: $card-light;
      border-radius: $radius-lg;
      border: 1px solid $card-border;
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: $space-3 $space-4;
        text-align: left;
        font-size: $text-sm;
        border-bottom: 1px solid $card-border;
        white-space: nowrap;
      }

      th {
        font-weight: 600;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: $text-xs;
        background: $bg-light;
      }

      tr:last-child td { border-bottom: none; }
      tr:hover td { background: $bg-light; }
    }

    .name-cell { font-weight: 600; }
    .text-muted { color: $text-muted; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: (res: any) => { this.users = res.data || res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  toggleUser(user: any): void {
    const action = user.enabled ? this.adminService.disableUser(user.userId) : this.adminService.enableUser(user.userId);
    action.subscribe({
      next: () => {
        user.enabled = !user.enabled;
        this.toast.show('User ' + (user.enabled ? 'enabled' : 'disabled'), 'success');
      },
      error: () => this.toast.show('Action failed', 'error')
    });
  }
}
