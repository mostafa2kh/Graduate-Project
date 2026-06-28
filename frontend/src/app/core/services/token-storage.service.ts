import { Injectable } from '@angular/core';

const TOKEN_KEY = 'rentsphere_access_token';
const USER_KEY = 'rentsphere_user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user) as T;
    }
    return null;
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
