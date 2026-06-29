import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { PreferencesData } from '../../core/models/profile.models';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
      <h1 class="section-title">Settings</h1>
      <p class="section-subtitle" style="margin-bottom: 2rem;">Manage your preferences and notifications</p>

      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header"><h3>Search Preferences</h3></div>
        <div class="card-body">
          <form (ngSubmit)="onSave()">
            <div class="form-row">
              <div class="form-group">
                <label>Min Price</label>
                <input class="input-field" type="number" [(ngModel)]="prefs.minPrice" name="minPrice" />
              </div>
              <div class="form-group">
                <label>Max Price</label>
                <input class="input-field" type="number" [(ngModel)]="prefs.maxPrice" name="maxPrice" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Bedrooms</label>
                <input class="input-field" type="number" [(ngModel)]="prefs.preferredBedrooms" name="preferredBedrooms" />
              </div>
              <div class="form-group">
                <label>Bathrooms</label>
                <input class="input-field" type="number" [(ngModel)]="prefs.preferredBathrooms" name="preferredBathrooms" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Property Type</label>
                <select class="input-field" [(ngModel)]="prefs.propertyType" name="propertyType">
                  <option value="">Any</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div class="form-group">
                <label>Furnished</label>
                <select class="input-field" [(ngModel)]="prefs.furnished" name="furnished">
                  <option value="">Any</option>
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save Preferences' }}
            </button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3>Notification Settings</h3></div>
        <div class="card-body">
          <div class="toggle-row">
            <span>Email notifications</span>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="prefs.notificationEmail" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-row">
            <span>Push notifications</span>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="prefs.notificationPush" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-row">
            <span>SMS notifications</span>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="prefs.notificationSms" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <button class="btn-primary" style="margin-top: 1rem;" (click)="onSave()" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-4;
      margin-bottom: $space-4;

      @include sm {
        grid-template-columns: 1fr;
      }
    }

    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-4 0;
      border-bottom: 1px solid $card-border;
      font-size: $text-sm;
      font-weight: 500;

      &:last-child {
        border-bottom: none;
      }
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 26px;
      cursor: pointer;

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .toggle-slider {
          background: $primary;
        }

        &:checked + .toggle-slider::before {
          transform: translateX(22px);
        }
      }
    }

    .toggle-slider {
      position: absolute;
      inset: 0;
      background: $card-border;
      border-radius: $radius-full;
      transition: all $transition-base;

      &::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        left: 3px;
        bottom: 3px;
        background: $card-light;
        border-radius: 50%;
        transition: all $transition-base;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  prefs: any = {
    minPrice: null,
    maxPrice: null,
    preferredBedrooms: null,
    preferredBathrooms: null,
    propertyType: '',
    furnished: '',
    notificationEmail: true,
    notificationPush: true,
    notificationSms: false
  };
  saving = false;

  constructor(
    private profileService: ProfileService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPreferences();
  }

  private loadPreferences(): void {
    this.profileService.getPreferences().subscribe({
      next: (res) => {
        if (res.data) {
          this.prefs = { ...this.prefs, ...res.data };
        }
      },
      error: () => this.toast.show('Failed to load preferences', 'error')
    });
  }

  onSave(): void {
    this.saving = true;
    this.profileService.updatePreferences(this.prefs).subscribe({
      next: () => {
        this.toast.show('Settings saved successfully', 'success');
        this.saving = false;
      },
      error: (err) => {
        this.toast.show(err.message || 'Failed to save settings', 'error');
        this.saving = false;
      }
    });
  }
}
