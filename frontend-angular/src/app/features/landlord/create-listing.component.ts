import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ListingService } from '../../core/services/listing.service';
import { ListingRequest } from '../../core/models/listing.models';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  template: `
    <div class="wizard-page">
      <div class="container">
        <div class="wizard-header">
          <a routerLink="/dashboard/listings" class="back-link">&larr; Back to Listings</a>
          <h1 class="wizard-title">Create New Listing</h1>
          <p class="wizard-subtitle">Fill in the details below to list your property</p>
        </div>

        <div class="wizard-steps">
          @for (step of steps; track step.number) {
            <div class="step" [class.active]="step.number === currentStep" [class.done]="step.number < currentStep">
              <div class="step-indicator">{{ step.number < currentStep ? '✓' : step.number }}</div>
              <span class="step-label">{{ step.label }}</span>
            </div>
          }
        </div>

        <div class="wizard-form">
          @if (currentStep === 1) {
            <div class="card">
              <div class="card-header"><h3>Basic Information</h3></div>
              <div class="card-body">
                <div class="form-group">
                  <label>Title *</label>
                  <input class="input-field" [(ngModel)]="form.title" placeholder="e.g. Modern 2BR Apartment in Downtown" />
                </div>
                <div class="form-group">
                  <label>Description *</label>
                  <textarea class="input-field" rows="5" [(ngModel)]="form.description" placeholder="Describe your property in detail (at least 20 characters)"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Property Type *</label>
                    <select class="input-field" [(ngModel)]="form.propertyType">
                      <option value="">Select...</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="studio">Studio</option>
                      <option value="penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Year Built</label>
                    <input class="input-field" type="number" [(ngModel)]="form.yearBuilt" placeholder="e.g. 2020" />
                  </div>
                </div>
              </div>
            </div>
          }

          @if (currentStep === 2) {
            <div class="card">
              <div class="card-header"><h3>Pricing & Details</h3></div>
              <div class="card-body">
                <div class="form-row">
                  <div class="form-group">
                    <label>Price *</label>
                    <input class="input-field" type="number" [(ngModel)]="form.price" placeholder="e.g. 15000" />
                  </div>
                  <div class="form-group">
                    <label>Currency</label>
                    <select class="input-field" [(ngModel)]="form.currency">
                      <option value="USD">USD</option>
                      <option value="EGP">EGP</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Bedrooms *</label>
                    <input class="input-field" type="number" min="1" [(ngModel)]="form.bedrooms" placeholder="e.g. 2" />
                  </div>
                  <div class="form-group">
                    <label>Bathrooms *</label>
                    <input class="input-field" type="number" min="1" [(ngModel)]="form.bathrooms" placeholder="e.g. 1" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Area Size</label>
                    <input class="input-field" type="number" [(ngModel)]="form.areaSize" placeholder="e.g. 120" />
                  </div>
                  <div class="form-group">
                    <label>Area Unit</label>
                    <select class="input-field" [(ngModel)]="form.areaUnit">
                      <option value="sqft">Sq. Ft.</option>
                      <option value="sqm">Sq. Meters</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="toggle-row">
                    <span>Furnished</span>
                    <label class="toggle">
                      <input type="checkbox" [(ngModel)]="isFurnished" />
                      <span class="toggle-slider"></span>
                    </label>
                  </label>
                </div>
              </div>
            </div>
          }

          @if (currentStep === 3) {
            <div class="card">
              <div class="card-header"><h3>Location</h3></div>
              <div class="card-body">
                <div class="form-group">
                  <label>Street</label>
                  <input class="input-field" [(ngModel)]="form.address.street" placeholder="Street address" />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>City *</label>
                    <input class="input-field" [(ngModel)]="form.address.city" placeholder="e.g. Cairo" />
                  </div>
                  <div class="form-group">
                    <label>Area *</label>
                    <input class="input-field" [(ngModel)]="form.address.area" placeholder="e.g. New Cairo" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>State</label>
                    <input class="input-field" [(ngModel)]="form.address.state" />
                  </div>
                  <div class="form-group">
                    <label>ZIP Code</label>
                    <input class="input-field" [(ngModel)]="form.address.zipCode" />
                  </div>
                </div>
              </div>
            </div>
          }

          @if (currentStep === 4) {
            <div class="card">
              <div class="card-header"><h3>Amenities</h3></div>
              <div class="card-body">
                @if (amenities.length === 0) {
                  <p class="text-muted">Loading amenities...</p>
                } @else {
                  <div class="amenities-grid">
                    @for (amenity of amenities; track amenity.id) {
                      <label class="amenity-chip" [class.selected]="selectedAmenities.has(amenity.name)">
                        <input type="checkbox" [checked]="selectedAmenities.has(amenity.name)" (change)="toggleAmenity(amenity.name)" class="hidden" />
                        {{ amenity.name }}
                      </label>
                    }
                  </div>
                }
                <p class="text-muted" style="margin-top:1rem;font-size:0.8rem;">Select at least one amenity</p>
              </div>
            </div>
          }

          @if (currentStep === 5) {
            <div class="card">
              <div class="card-header"><h3>Availability</h3></div>
              <div class="card-body">
                <p class="text-muted" style="margin-bottom:1rem;">Add date ranges when your property is available</p>

                @for (slot of availabilitySlots; track i; let i = $index) {
                  <div class="availability-slot">
                    <div class="form-row">
                      <div class="form-group">
                        <label>Start Date</label>
                        <input class="input-field" type="date" [(ngModel)]="slot.startDate" />
                      </div>
                      <div class="form-group">
                        <label>End Date</label>
                        <input class="input-field" type="date" [(ngModel)]="slot.endDate" />
                      </div>
                    </div>
                    <button class="btn-outline btn-sm" (click)="removeSlot(i)">Remove</button>
                  </div>
                }

                <button class="btn-outline btn-sm" (click)="addSlot()">
                  + Add Date Range
                </button>
              </div>
            </div>
          }

          @if (currentStep === 6) {
            <div class="card">
              <div class="card-header"><h3>Review & Submit</h3></div>
              <div class="card-body">
                <div class="review-section">
                  <div class="review-group">
                    <h4>Basic Info</h4>
                    <p><strong>Title:</strong> {{ form.title }}</p>
                    <p><strong>Type:</strong> {{ form.propertyType }}</p>
                    <p><strong>Description:</strong> {{ form.description?.substring(0, 100) }}...</p>
                  </div>
                  <div class="review-group">
                    <h4>Pricing & Details</h4>
                    <p><strong>Price:</strong> {{ form.currency || 'USD' }} {{ form.price }}</p>
                    <p><strong>Bedrooms:</strong> {{ form.bedrooms }} | <strong>Bathrooms:</strong> {{ form.bathrooms }}</p>
                    <p><strong>Furnished:</strong> {{ isFurnished ? 'Yes' : 'No' }}</p>
                  </div>
                  <div class="review-group">
                    <h4>Location</h4>
                    <p>{{ form.address?.city }}{{ form.address?.area ? ', ' + form.address?.area : '' }}</p>
                  </div>
                  <div class="review-group">
                    <h4>Amenities ({{ selectedAmenities.size }})</h4>
                    <p>{{ getSelectedAmenities() }}</p>
                  </div>
                  <div class="review-group">
                    <h4>Availability ({{ availabilitySlots.length }} range(s))</h4>
                    @for (slot of availabilitySlots; track i; let i = $index) {
                      <p>{{ slot.startDate }} to {{ slot.endDate }}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          }

          <div class="wizard-actions">
            @if (currentStep > 1) {
              <button class="btn-outline" (click)="prevStep()">Previous</button>
            }
            @if (currentStep < 6) {
              <button class="btn-primary" (click)="nextStep()">Next</button>
            }
            @if (currentStep === 6) {
              <button class="btn-primary btn-lg" (click)="onSubmit()" [disabled]="submitting">
                {{ submitting ? 'Creating...' : 'Create Listing' }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .wizard-page {
      padding: $space-8 0;
    }

    .wizard-header {
      margin-bottom: $space-8;
    }

    .back-link {
      display: inline-block;
      font-size: $text-sm;
      color: $primary;
      text-decoration: none;
      margin-bottom: $space-4;
      font-weight: 500;

      &:hover { text-decoration: underline; }
    }

    .wizard-title {
      font-size: $text-3xl;
      font-weight: 800;
    }

    .wizard-subtitle {
      font-size: $text-sm;
      color: $text-muted;
      margin-top: $space-2;
    }

    .wizard-steps {
      display: flex;
      gap: $space-2;
      margin-bottom: $space-8;
      overflow-x: auto;

      @include sm { gap: $space-1; }
    }

    .step {
      display: flex;
      align-items: center;
      gap: $space-2;
      flex-shrink: 0;

      @include sm { font-size: $text-xs; }
    }

    .step-indicator {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $text-sm;
      font-weight: 700;
      background: $bg-gray;
      color: $text-muted;
      transition: all $transition-base;
    }

    .step.active .step-indicator {
      background: $primary;
      color: $text-white;
    }

    .step.done .step-indicator {
      background: $success;
      color: $text-white;
    }

    .step-label {
      font-size: $text-sm;
      font-weight: 500;
      color: $text-muted;
      white-space: nowrap;

      .step.active & { color: $primary; }
      .step.done & { color: $success; }
    }

    .wizard-form {
      max-width: 720px;
      margin: 0 auto;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $space-4;
      margin-bottom: $space-4;

      @include sm { grid-template-columns: 1fr; }
    }

    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-3 0;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      cursor: pointer;

      input { opacity: 0; width: 0; height: 0; }

      input:checked + .toggle-slider { background: $primary; }
      input:checked + .toggle-slider::before { transform: translateX(20px); }
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
        width: 18px;
        height: 18px;
        left: 3px;
        bottom: 3px;
        background: $card-light;
        border-radius: 50%;
        transition: all $transition-base;
      }
    }

    .amenities-grid {
      display: flex;
      flex-wrap: wrap;
      gap: $space-2;
    }

    .amenity-chip {
      padding: $space-2 $space-4;
      border: 1.5px solid $card-border;
      border-radius: $radius-full;
      font-size: $text-sm;
      cursor: pointer;
      transition: all $transition-base;

      &:hover { border-color: $primary-light; }
      &.selected { background: $primary-bg; border-color: $primary; color: $primary; font-weight: 600; }
    }

    .hidden { display: none; }

    .availability-slot {
      background: $bg-light;
      border-radius: $radius-md;
      padding: $space-4;
      margin-bottom: $space-3;
    }

    .wizard-actions {
      display: flex;
      justify-content: flex-end;
      gap: $space-3;
      margin-top: $space-6;
    }

    .review-section {
      display: flex;
      flex-direction: column;
      gap: $space-6;
    }

    .review-group {
      h4 {
        font-size: $text-sm;
        font-weight: 700;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: $space-3;
        padding-bottom: $space-2;
        border-bottom: 1px solid $card-border;
      }

      p {
        font-size: $text-sm;
        margin-bottom: $space-1;
      }
    }

    .text-muted {
      color: $text-muted;
    }
  `]
})
export class CreateListingComponent implements OnInit {
  currentStep = 1;
  submitting = false;
  amenities: any[] = [];
  selectedAmenities = new Set<string>();
  isFurnished = false;
  availabilitySlots: { startDate: string; endDate: string }[] = [];

  steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Pricing' },
    { number: 3, label: 'Location' },
    { number: 4, label: 'Amenities' },
    { number: 5, label: 'Availability' },
    { number: 6, label: 'Review' },
  ];

  form: any = {
    title: '',
    description: '',
    propertyType: '',
    price: null,
    currency: 'USD',
    bedrooms: null,
    bathrooms: null,
    areaSize: null,
    areaUnit: 'sqft',
    yearBuilt: null,
    address: { street: '', city: '', area: '', state: '', zipCode: '' },
  };

  constructor(
    private listingService: ListingService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAmenities();
    this.addSlot();
  }

  private loadAmenities(): void {
    this.listingService.getAmenities().subscribe({
      next: (res) => this.amenities = res.data || []
    });
  }

  toggleAmenity(name: string): void {
    if (this.selectedAmenities.has(name)) this.selectedAmenities.delete(name);
    else this.selectedAmenities.add(name);
  }

  addSlot(): void {
      this.availabilitySlots.push({ startDate: '', endDate: '' });
  }

  getSelectedAmenities(): string {
    const arr: string[] = [];
    this.selectedAmenities.forEach(a => arr.push(a));
    return arr.join(', ');
  }

  removeSlot(index: number): void {
    this.availabilitySlots.splice(index, 1);
  }

  nextStep(): void {
    if (this.currentStep < 6) this.currentStep++;
    window.scrollTo(0, 0);
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
    window.scrollTo(0, 0);
  }

  onSubmit(): void {
    if (!this.form.title || !this.form.description || !this.form.price || !this.form.propertyType) {
      this.toast.show('Please fill in all required fields', 'error');
      return;
    }

    this.submitting = true;
    const request: any = {
      title: this.form.title,
      description: this.form.description,
      price: this.form.price,
      currency: this.form.currency || 'USD',
      propertyType: this.form.propertyType,
      bedrooms: this.form.bedrooms || 1,
      bathrooms: this.form.bathrooms || 1,
      areaSize: this.form.areaSize,
      areaUnit: this.form.areaUnit,
      yearBuilt: this.form.yearBuilt,
      furnished: this.isFurnished,
      address: this.form.address?.city ? {
        street: this.form.address.street,
        city: this.form.address.city,
        area: this.form.address.area,
        state: this.form.address.state,
        zipCode: this.form.address.zipCode,
      } : undefined,
      amenityNames: [...this.selectedAmenities],
      availability: this.availabilitySlots
        .filter(s => s.startDate && s.endDate)
        .map(s => ({ startDate: s.startDate, endDate: s.endDate, available: true })),
    };

    this.listingService.createDraft(request).subscribe({
      next: (res) => {
        this.toast.show('Listing draft created!', 'success');
        this.router.navigate(['/dashboard/listings', res.data.id]);
      },
      error: (err) => {
        this.toast.show(err.message || 'Failed to create listing', 'error');
        this.submitting = false;
      }
    });
  }
}
