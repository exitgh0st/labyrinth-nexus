/**
 * Authentication service - manages user authentication state
 * @module auth/services
 */

import { Injectable, Inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, switchMap, firstValueFrom } from 'rxjs';

import { AUTH_CONFIG } from '../config/auth-config';
import { ADMIN_CORE_CONFIG } from '../../core/config/tokens';
import {
  AuthUser,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenResponse,
} from '../models/auth.models';
import { decodeJwt, isJwtExpired, getJwtTimeRemaining } from '../../core/utils/jwt.util';

/**
 * Core authentication service
 * Manages authentication state, token lifecycle, and user session
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // State
  private accessToken = signal<string | null>(null);
  private _user = signal<AuthUser | null>(null);
  private isInitialized = signal(false);
  private isLoading = signal(false);
  private error = signal<string | null>(null);
  private isRefreshing$ = new BehaviorSubject<boolean>(false);

  // Timers
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  private lastActivityTime = signal<number>(Date.now());

  // Public computed signals
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this.accessToken() !== null && this._user() !== null);
  readonly loading = this.isLoading.asReadonly();
  readonly authError = this.error.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(AUTH_CONFIG) private authConfig: any,
    @Inject(ADMIN_CORE_CONFIG) private coreConfig: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadTokenFromStorage();
    this.setupActivityTracking();
    if (this.authConfig.session.enableCrossTabSync) {
      this.setupCrossTabSync();
    }
  }

  /**
   * Initialize authentication on app startup
   * Attempts to refresh token if available
   */
  async initialize(): Promise<void> {
    if (this.isInitialized()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(this.refreshToken());
      this.setAuth(response);
    } catch (error) {
      this.clearAuth();
    } finally {
      this.isInitialized.set(true);
      this.isLoading.set(false);
    }
  }

  /**
   * Login with credentials
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    const apiUrl = this.coreConfig.apiBaseUrl + this.authConfig.endpoints.login;

    return this.http
      .post<AuthResponse>(apiUrl, credentials, {
        withCredentials: this.authConfig.http.withCredentials,
      })
      .pipe(
        tap((response) => {
          this.setAuth(response);
          this.scheduleTokenRefresh();
          this.resetInactivityTimer();
          this.navigateAfterLogin();
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.error.set(error.error?.message || 'Login failed');
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    const apiUrl = this.coreConfig.apiBaseUrl + this.authConfig.endpoints.register;

    return this.http
      .post<AuthResponse>(apiUrl, userData, {
        withCredentials: this.authConfig.http.withCredentials,
      })
      .pipe(
        tap((response) => {
          this.setAuth(response);
          this.scheduleTokenRefresh();
          this.resetInactivityTimer();
          this.navigateAfterLogin();
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.error.set(error.error?.message || 'Registration failed');
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    const apiUrl = this.coreConfig.apiBaseUrl + this.authConfig.endpoints.logout;

    return this.http
      .post<void>(apiUrl, {}, {
        withCredentials: this.authConfig.http.withCredentials,
      })
      .pipe(
        tap(() => {
          this.clearAuth();
          this.clearTimers();
          this.navigateAfterLogout();
        }),
        catchError((error) => {
          // Clear auth even if logout request fails
          this.clearAuth();
          this.clearTimers();
          this.navigateAfterLogout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing$.value) {
      return new Observable<AuthResponse>((observer) => {
        const subscription = this.isRefreshing$.subscribe((isRefreshing) => {
          if (!isRefreshing) {
            const token = this.accessToken();
            const user = this._user();
            if (token && user) {
              observer.next({ accessToken: token, user });
              observer.complete();
            } else {
              observer.error(new Error('No token available after refresh'));
            }
            subscription.unsubscribe();
          }
        });
      });
    }

    this.isRefreshing$.next(true);

    const apiUrl = this.coreConfig.apiBaseUrl + this.authConfig.endpoints.refresh;

    return this.http
      .post<AuthResponse>(apiUrl, {}, {
        withCredentials: this.authConfig.http.withCredentials,
      })
      .pipe(
        tap((response) => {
          this.setAuth(response);
          this.scheduleTokenRefresh();
          this.isRefreshing$.next(false);
        }),
        catchError((error) => {
          this.isRefreshing$.next(false);
          this.clearAuth();
          this.router.navigate([this.authConfig.routes.login]);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken();
  }

  /**
   * Get OAuth login URL
   */
  getOAuthUrl(provider: 'google' | 'github' | 'facebook' | string): string {
    const endpoint = this.authConfig.endpoints.oauth?.[provider];
    if (!endpoint) {
      throw new Error(`OAuth provider ${provider} not configured`);
    }
    return this.coreConfig.apiBaseUrl + endpoint;
  }

  /**
   * Handle OAuth callback (for SPA-based OAuth flow)
   */
  handleOAuthCallback(): Observable<AuthResponse> {
    const apiUrl = this.coreConfig.apiBaseUrl + '/auth/oauth/callback';

    return this.http
      .get<AuthResponse>(apiUrl, {
        withCredentials: this.authConfig.http.withCredentials,
      })
      .pipe(
        tap((response) => {
          this.setAuth(response);
          this.scheduleTokenRefresh();
          this.resetInactivityTimer();
          this.navigateAfterLogin();
        }),
        catchError((error) => {
          this.error.set(error.error?.message || 'OAuth login failed');
          return throwError(() => error);
        })
      );
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this._user();
    return user?.roles?.some((r) => r.name === role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  /**
   * Update user data
   */
  updateUser(userData: Partial<AuthUser>): void {
    const currentUser = this._user();
    if (currentUser) {
      this._user.set({ ...currentUser, ...userData });
    }
  }

  /**
   * Record user activity (for inactivity timeout)
   */
  recordActivity(): void {
    this.lastActivityTime.set(Date.now());
    this.resetInactivityTimer();
  }

  /**
   * Hard reset - clear everything
   */
  reset(): void {
    this.clearAuth();
    this.clearTimers();
    this.isInitialized.set(false);
    this.isRefreshing$.next(false);
    this.error.set(null);
  }

  /**
   * Set authentication data
   */
  private setAuth(response: AuthResponse): void {
    this.accessToken.set(response.accessToken);
    this._user.set(response.user);
    this.saveTokenToStorage(response.accessToken);
    this.isInitialized.set(true);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.accessToken.set(null);
    this._user.set(null);
    this.removeTokenFromStorage();

    // Notify other tabs
    if (this.authConfig.session.enableCrossTabSync) {
      localStorage.setItem('auth_logout', Date.now().toString());
      localStorage.removeItem('auth_logout');
    }
  }

  /**
   * Schedule automatic token refresh before expiry
   */
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const token = this.accessToken();
    if (!token) return;

    const timeRemaining = getJwtTimeRemaining(token);
    if (timeRemaining === null) return;

    const refreshBeforeExpiry = this.authConfig.session.refreshBeforeExpiry || 2 * 60 * 1000;
    const refreshIn = timeRemaining - refreshBeforeExpiry;

    if (refreshIn > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken().subscribe({
          error: (error) => console.error('Auto-refresh failed:', error),
        });
      }, refreshIn);
    } else {
      // Token expired or expiring soon, refresh immediately
      this.refreshToken().subscribe({
        error: (error) => console.error('Immediate refresh failed:', error),
      });
    }
  }

  /**
   * Setup activity tracking for inactivity timeout
   */
  private setupActivityTracking(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      window.addEventListener(event, () => this.recordActivity(), { passive: true });
    });
  }

  /**
   * Reset inactivity timer
   */
  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    if (!this.isAuthenticated()) return;

    const timeout = this.authConfig.session.inactivityTimeout;
    if (!timeout) return;

    this.inactivityTimer = setTimeout(() => {
      this.logout().subscribe();
    }, timeout);
  }

  /**
   * Setup cross-tab synchronization
   */
  private setupCrossTabSync(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_logout') {
        this.clearAuth();
        this.router.navigate([this.authConfig.routes.login]);
      }
    });
  }

  /**
   * Save token to storage
   */
  private saveTokenToStorage(token: string): void {
    const storage = this.authConfig.token.storage;
    const key = this.authConfig.token.accessTokenKey || 'access_token';

    if (storage === 'localStorage') {
      localStorage.setItem(key, token);
    } else if (storage === 'sessionStorage') {
      sessionStorage.setItem(key, token);
    }
    // For 'memory' storage, we don't persist the token
  }

  /**
   * Load token from storage
   */
  private loadTokenFromStorage(): void {
    const storage = this.authConfig.token.storage;
    const key = this.authConfig.token.accessTokenKey || 'access_token';

    let token: string | null = null;

    if (storage === 'localStorage') {
      token = localStorage.getItem(key);
    } else if (storage === 'sessionStorage') {
      token = sessionStorage.getItem(key);
    }

    if (token) {
      this.accessToken.set(token);
    }
  }

  /**
   * Remove token from storage
   */
  private removeTokenFromStorage(): void {
    const storage = this.authConfig.token.storage;
    const key = this.authConfig.token.accessTokenKey || 'access_token';

    if (storage === 'localStorage') {
      localStorage.removeItem(key);
    } else if (storage === 'sessionStorage') {
      sessionStorage.removeItem(key);
    }
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }
  }

  /**
   * Navigate after successful login
   */
  private navigateAfterLogin(): void {
    const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'];
    const defaultRoute = this.authConfig.routes.afterLogin || '/';
    this.router.navigate([returnUrl || defaultRoute]);
  }

  /**
   * Navigate after logout
   */
  private navigateAfterLogout(): void {
    const route = this.authConfig.routes.afterLogout || '/login';
    this.router.navigate([route]);
  }
}
