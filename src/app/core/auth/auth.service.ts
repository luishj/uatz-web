import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthResponse, LoginRequest } from '../models/auth.models';

const AUTH_STORAGE_KEY = 'uatz.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly authState = signal<AuthResponse | null>(this.restoreSession());

  readonly session = this.authState.asReadonly();
  readonly token = computed(() => this.authState()?.accessToken ?? null);
  readonly isAuthenticated = computed(() => this.authState() !== null);
  readonly currentUser = computed(() => this.authState());
  readonly isVendor = computed(() => this.currentUser()?.role === 'VENDOR');

  login(payload: LoginRequest) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  logout() {
    this.authState.set(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    void this.router.navigate(['/login']);
  }

  private persistSession(response: AuthResponse) {
    this.authState.set(response);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
  }

  private restoreSession(): AuthResponse | null {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthResponse;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
}
