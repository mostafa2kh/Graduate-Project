import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ProfileData, PreferencesData, VerificationSummary } from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(private api: ApiService) {}

  getProfile(): Observable<any> {
    return this.api.get<ProfileData>('/users/me');
  }

  updateProfile(data: Partial<ProfileData>): Observable<any> {
    return this.api.put<ProfileData>('/users/me', data);
  }

  getPreferences(): Observable<any> {
    return this.api.get<PreferencesData>('/users/me/preferences');
  }

  updatePreferences(data: Partial<PreferencesData>): Observable<any> {
    return this.api.put<PreferencesData>('/users/me/preferences', data);
  }

  getVerificationSummary(): Observable<any> {
    return this.api.get<VerificationSummary>('/users/me/verification-summary');
  }

  getFavorites(): Observable<any> {
    return this.api.get<string[]>('/users/me/favorites');
  }

  addFavorite(listingId: string): Observable<any> {
    return this.api.post(`/users/me/favorites/${listingId}`);
  }

  removeFavorite(listingId: string): Observable<any> {
    return this.api.delete(`/users/me/favorites/${listingId}`);
  }
}
