import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { RegisterRequest, LoginRequest, AuthData, UserData, AuthResponse, UserResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private api: ApiService,
    private tokenStorage: TokenStorageService
  ) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthData>('/auth/register', request).pipe(
      tap(response => {
        if (response.data) {
          this.tokenStorage.saveToken(response.data.accessToken);
          this.tokenStorage.saveUser({ userId: response.data.userId, email: response.data.email, fullName: response.data.fullName, roles: response.data.roles });
        }
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthData>('/auth/login', request).pipe(
      tap(response => {
        if (response.data) {
          this.tokenStorage.saveToken(response.data.accessToken);
          this.tokenStorage.saveUser({ userId: response.data.userId, email: response.data.email, fullName: response.data.fullName, roles: response.data.roles });
        }
      })
    );
  }

  logout(): Observable<unknown> {
    return this.api.post('/auth/logout').pipe(
      tap(() => this.tokenStorage.clear())
    );
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.api.get<UserData>('/auth/me');
  }

  isAuthenticated(): boolean {
    return this.tokenStorage.isLoggedIn();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.tokenStorage.getUser<{ roles: string[] }>();
    return user?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
}
