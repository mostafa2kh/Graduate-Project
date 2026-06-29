import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LookupService {
  private base = environment.apiUrl;
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getListingTitle(listingId: string): Observable<string> {
    const key = `listing_${listingId}`;
    if (!this.cache.has(key)) {
      this.cache.set(key, this.http.get(`${this.base}/search/${listingId}`).pipe(
        map((res: any) => (res.data || res).title || listingId),
        shareReplay(1)
      ));
    }
    return this.cache.get(key)!;
  }

  getUserName(userId: string): Observable<string> {
    const key = `user_${userId}`;
    if (!this.cache.has(key)) {
      this.cache.set(key, this.http.get(`${this.base}/users/public/${userId}`).pipe(
        map((res: any) => {
          const d = res.data || res;
          return d.fullName || d.firstName + ' ' + d.lastName || userId;
        }),
        shareReplay(1)
      ));
    }
    return this.cache.get(key)!;
  }
}
