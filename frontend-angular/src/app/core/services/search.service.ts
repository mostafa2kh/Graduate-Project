import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private api: ApiService) {}

  search(params: Record<string, any>): Observable<any> {
    let hp = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v != null && v !== '') hp = hp.set(k, String(v));
    }
    return this.api.get('/search/listings', hp);
  }

  getListingDetail(id: string): Observable<any> {
    return this.api.get(`/search/listings/${id}`);
  }

  getFilterOptions(): Observable<any> {
    return this.api.get('/search/filters/options');
  }
}
