import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="table-wrapper">
      @if (title || actions) {
        <div class="table-toolbar">
          @if (title) { <h3 class="table-title">{{ title }}</h3> }
          @if (actions) {
            <div class="table-actions">
              <ng-content select="[table-actions]" />
            </div>
          }
        </div>
      }
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th [style.width]="col.width" [class.sortable]="col.sortable" (click)="col.sortable && sort.emit(col.key)">
                  {{ col.label }}
                  @if (col.sortable) {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sort-icon">
                      <path d="M8 3l4 4-4 4M16 21l-4-4 4-4"/>
                    </svg>
                  }
                </th>
              }
              @if (rowActions) {
                <th class="actions-header">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @if (data.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length + (rowActions ? 1 : 0)" class="empty-row">
                  <div class="empty-cell">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                    </svg>
                    <p>{{ emptyMessage }}</p>
                  </div>
                </td>
              </tr>
            }
            @for (row of data; track row[trackBy || '_id']) {
              <tr (click)="rowClick.emit(row)" [class.clickable]="rowClick.observed">
                @for (col of columns; track col.key) {
                  <td>{{ row[col.key] }}</td>
                }
                @if (rowActions) {
                  <td class="actions-cell">
                    <ng-container [ngTemplateOutlet]="rowActions" [ngTemplateOutletContext]="{ $implicit: row }" />
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (showFooter && data.length > 0) {
        <div class="table-footer">
          <span class="table-count">{{ data.length }} record(s)</span>
          <ng-content select="[table-footer]" />
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .table-wrapper {
      background: $card-light;
      border-radius: $radius-xl;
      border: 1px solid $card-border;
      overflow: hidden;
    }

    .table-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-5 $space-6;
      border-bottom: 1px solid $card-border;
    }

    .table-title {
      font-size: $text-lg;
      font-weight: 700;
    }

    .table-actions {
      display: flex;
      gap: $space-3;
    }

    .table-scroll {
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      text-align: left;
      padding: $space-3 $space-5;
      font-size: $text-xs;
      font-weight: 600;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: $bg-light;
      border-bottom: 1px solid $card-border;
      white-space: nowrap;

      &.sortable {
        cursor: pointer;
        user-select: none;

        &:hover { color: $text-dark; }
      }

      .sort-icon {
        width: 14px;
        height: 14px;
        margin-left: $space-1;
        vertical-align: middle;
      }
    }

    tbody td {
      padding: $space-3 $space-5;
      font-size: $text-sm;
      border-bottom: 1px solid $card-border;
      vertical-align: middle;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tr.clickable {
      cursor: pointer;
      transition: background $transition-fast;

      &:hover { background: $bg-light; }
    }

    .actions-header {
      width: 80px;
      text-align: right;
    }

    .actions-cell {
      text-align: right;
    }

    .empty-row td {
      padding: $space-10 $space-5;
    }

    .empty-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-3;
      color: $text-light;

      svg { width: 40px; height: 40px; }
      p { font-size: $text-sm; color: $text-muted; }
    }

    .table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-4 $space-6;
      border-top: 1px solid $card-border;
    }

    .table-count {
      font-size: $text-xs;
      color: $text-muted;
    }
  `]
})
export class TableComponent {
  @Input() title = '';
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() trackBy = 'id';
  @Input() emptyMessage = 'No data available';
  @Input() showFooter = false;
  @Input() actions = false;
  @Input() rowActions?: TemplateRef<any>;
  @Output() sort = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<any>();
}
