import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

interface UploadFile {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  result?: any;
}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  template: `
    <div class="upload-container">
      <div class="upload-area"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           [class.dragging]="dragging"
           (click)="fileInput.click()">
        <input #fileInput type="file" multiple accept="image/jpeg,image/png,image/webp"
               (change)="onFilesSelected($event)" hidden />
        <div class="upload-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p class="upload-text">{{ minCount > 0 ? 'Drag & drop images here or click to browse' : 'Upload Images' }}</p>
          <p class="upload-hint">JPEG, PNG, or WebP &middot; Max {{ maxFileSize }}MB each</p>
          @if (minCount > 0) {
            <p class="upload-count">Minimum {{ minCount }} images required ({{ currentCount }}/{{ minCount }})</p>
          }
        </div>
      </div>

      @if (selectedFiles.length > 0) {
        <div class="preview-grid">
          @for (item of selectedFiles; track item.file.name + item.file.lastModified) {
            <div class="preview-item" [class.uploaded]="item.uploaded" [class.error]="item.error">
              <img [src]="item.preview" [alt]="item.file.name" class="preview-img" />
              <div class="preview-overlay">
                <button class="btn-icon" (click)="removeFile(item)" title="Remove">&times;</button>
                @if (item.error) {
                  <span class="error-msg">{{ item.error }}</span>
                }
              </div>
              <div class="preview-info">
                <span class="file-name">{{ item.file.name }}</span>
                <span class="file-size">{{ (item.file.size / 1024 / 1024).toFixed(1) }} MB</span>
              </div>
            </div>
          }
        </div>
      }

      @if (selectedFiles.length > 0) {
        <div class="upload-actions">
          <span class="file-count">{{ selectedFiles.length }} file(s) selected</span>
          <button class="btn-primary btn-sm" (click)="onUpload()" [disabled]="uploading || selectedFiles.length === 0">
            {{ uploading ? 'Uploading...' : 'Upload Images' }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'index' as *;

    .upload-container {
      margin: $space-4 0;
    }

    .upload-area {
      border: 2px dashed $card-border;
      border-radius: $radius-lg;
      padding: $space-12 $space-6;
      text-align: center;
      cursor: pointer;
      transition: all $transition-base;
      background: $bg-light;

      &:hover, &.dragging {
        border-color: $primary;
        background: $primary-bg;
      }
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-3;
      color: $text-muted;
    }

    .upload-text {
      font-size: $text-base;
      font-weight: 600;
      color: $text-dark;
    }

    .upload-hint {
      font-size: $text-xs;
      color: $text-muted;
    }

    .upload-count {
      font-size: $text-sm;
      font-weight: 600;
      color: $warning;
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: $space-3;
      margin-top: $space-4;
    }

    .preview-item {
      position: relative;
      border-radius: $radius-md;
      overflow: hidden;
      border: 2px solid $card-border;
      background: $card-light;
      aspect-ratio: 4 / 3;

      &.uploaded { border-color: $success; }
      &.error { border-color: $danger; }
    }

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .preview-overlay {
      position: absolute;
      top: $space-1;
      right: $space-1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: $space-1;
    }

    .btn-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: rgba(0,0,0,0.6);
      color: white;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover { background: rgba(0,0,0,0.8); }
    }

    .error-msg {
      font-size: $text-xs;
      color: $danger;
      background: $card-light;
      padding: $space-1 $space-2;
      border-radius: $radius-sm;
      white-space: nowrap;
    }

    .preview-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      padding: $space-6 $space-2 $space-2;
      display: flex;
      flex-direction: column;
    }

    .file-name {
      font-size: $text-xs;
      color: white;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      font-size: 10px;
      color: rgba(255,255,255,0.7);
    }

    .upload-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-4;
      padding-top: $space-3;
      border-top: 1px solid $card-border;
    }

    .file-count {
      font-size: $text-sm;
      color: $text-muted;
    }
  `]
})
export class ImageUploadComponent {
  @Input() listingId = '';
  @Input() minCount = 0;
  @Input() maxCount = 20;
  @Input() maxFileSize = 10;
  @Input() currentCount = 0;
  @Output() uploadComplete = new EventEmitter<any[]>();

  dragging = false;
  uploading = false;
  selectedFiles: UploadFile[] = [];

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragging = true;
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragging = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragging = false;
    if (e.dataTransfer?.files) {
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  }

  onFilesSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
      input.value = '';
    }
  }

  private addFiles(files: File[]): void {
    const totalAfter = this.currentCount + this.selectedFiles.length + files.length;
    if (totalAfter > this.maxCount) {
      const canAdd = this.maxCount - this.currentCount - this.selectedFiles.length;
      if (canAdd <= 0) return;
      files = files.slice(0, canAdd);
    }

    files.forEach(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.selectedFiles.push({ file, preview: '', uploading: false, uploaded: false, error: 'Invalid type. JPEG, PNG, WebP only.' });
        return;
      }
      if (file.size > this.maxFileSize * 1024 * 1024) {
        this.selectedFiles.push({ file, preview: '', uploading: false, uploaded: false, error: 'Max ' + this.maxFileSize + 'MB' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        this.selectedFiles.push({ file, preview, uploading: false, uploaded: false });
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(item: UploadFile): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== item);
  }

  onUpload(): void {
    if (!this.listingId || this.uploading || this.selectedFiles.length === 0) return;
    this.uploading = true;

    const filesToUpload = this.selectedFiles
      .filter(f => !f.uploaded && !f.error)
      .map(f => f.file);

    if (filesToUpload.length === 0) {
      this.uploading = false;
      return;
    }

    // Use native fetch for multipart upload since ApiService wraps in ApiResponse
    const formData = new FormData();
    filesToUpload.forEach(f => formData.append('files', f));

    fetch(`http://localhost:8080/api/media/listings/${this.listingId}/images`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    })
    .then((results: any[]) => {
      this.uploadComplete.emit(results);
      this.selectedFiles = [];
      this.currentCount += filesToUpload.length;
      this.uploading = false;
    })
    .catch(err => {
      console.error('Upload error:', err);
      this.uploading = false;
    });
  }
}
