import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError, throwError, BehaviorSubject, Observable, switchMap, firstValueFrom, timer, takeUntil } from 'rxjs';
import { AuthApi, AuthResponse, LoginRequest, RegisterRequest } from './auth-api';
import { User } from '../../user/models/user.model';

// Helper to decode JWT without validation
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authApi = inject(AuthApi);
  private router = inject(Router);

  // State
  private accessToken = signal<string | null>(null);
  user = signal<User | null>(null);
  private isInitialized = signal(false);
  private isRefreshing$ = new BehaviorSubject<boolean>(false);
  
  // Auto-refresh timer
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private readonly REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes

  // Session activity tracking
  private lastActivityTime = signal<number>(Date.now());
  private readonly INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  private inactivityTimer?: ReturnType<typeof setTimeout>;

  // Public computed signals
  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = computed(() => this.accessToken() !== null && this.user() !== null);

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupActivityTracking();
      this.setupCrossTabSync();
    }
  }

  /**
   * Login with credentials
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.authApi.login(credentials).pipe(
      tap(response => {
        this.setAuth(response);
        this.scheduleTokenRefresh();
        this.resetInactivityTimer();
        console.log('Login successful');
      }),
      catchError(error => {
        this.clearAuth();
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.authApi.register(userData).pipe(
      tap(response => {
        this.setAuth(response);
        this.scheduleTokenRefresh();
        this.resetInactivityTimer();
        console.log('Registration successful');
      }),
      catchError(error => {
        this.clearAuth();
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Handle OAuth login
   */
  async handleOAuthLogin(): Promise<AuthResponse | null> {
    try {
      const response = await firstValueFrom(this.authApi.handleOAuthCallback());
      this.setAuth(response);
      this.scheduleTokenRefresh();
      this.resetInactivityTimer();
      console.log('OAuth login successful');
      return response;
    } catch (error) {
      console.error('OAuth login failed:', error);
      this.clearAuth();
      return null;
    }
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    return this.authApi.logout().pipe(
      tap(() => {
        console.log('Logout successful');
        this.clearAuth();
        this.clearTimers();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        this.clearAuth();
        this.clearTimers();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshAccessToken(): Observable<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing$.value) {
      return new Observable<string>(observer => {
        const subscription = this.isRefreshing$.subscribe(isRefreshing => {
          if (!isRefreshing) {
            const token = this.accessToken();
            if (token) {
              observer.next(token);
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

    return this.authApi.refreshToken().pipe(
      tap(response => {
        console.log('Access token refreshed successfully');
        this.accessToken.set(response.accessToken);
        this.user.set(response.user);
        this.scheduleTokenRefresh();
        this.isRefreshing$.next(false);
      }),
      switchMap(response => {
        return new Observable<string>(observer => {
          observer.next(response.accessToken);
          observer.complete();
        });
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.isRefreshing$.next(false);
        this.clearAuth();
        this.router.navigate(['/login']);
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
   * Initialize auth on app startup
   */
  async initializeAuth(): Promise<void> {
    if (this.isInitialized()) {
      return;
    }

    try {
      const response = await firstValueFrom(this.authApi.refreshToken());
      this.accessToken.set(response.accessToken);
      this.user.set(response.user);
      this.scheduleTokenRefresh();
      this.resetInactivityTimer();
    } catch (error) {
      console.log('Auth initialization - no valid session');
    } finally {
      this.isInitialized.set(true);
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.user();
    return user?.roles?.some(r => r.name === role) ?? false;
  }

  /**
   * Update user data
   */
  updateUser(userData: Partial<User>): void {
    const currentUser = this.user();
    if (currentUser) {
      this.user.set({ ...currentUser, ...userData });
    }
  }

  /**
   * Track user activity for session timeout
   */
  recordActivity(): void {
    this.lastActivityTime.set(Date.now());
    this.resetInactivityTimer();
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

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return;

    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const refreshIn = expiresAt - now - this.REFRESH_BEFORE_EXPIRY_MS;

    if (refreshIn > 0) {
      console.log(`Token refresh scheduled in ${Math.round(refreshIn / 1000)} seconds`);
      this.refreshTimer = setTimeout(() => {
        console.log('Auto-refreshing token...');
        this.refreshAccessToken().subscribe({
          error: (error) => console.error('Auto-refresh failed:', error)
        });
      }, refreshIn);
    } else {
      // Token already expired or about to expire, refresh immediately
      console.log('Token expired or expiring soon, refreshing immediately...');
      this.refreshAccessToken().subscribe({
        error: (error) => console.error('Immediate refresh failed:', error)
      });
    }
  }

  /**
   * Setup activity tracking for inactivity timeout
   */
  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
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

    this.inactivityTimer = setTimeout(() => {
      console.log('Session timed out due to inactivity');
      this.logout().subscribe();
    }, this.INACTIVITY_TIMEOUT_MS);
  }

  /**
   * Setup cross-tab synchronization
   */
  private setupCrossTabSync(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_logout') {
        console.log('Logout detected in another tab');
        this.clearAuth();
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Set authentication data
   */
  private setAuth(response: AuthResponse): void {
    this.accessToken.set(response.accessToken);
    this.user.set(response.user);
    this.isInitialized.set(true);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.accessToken.set(null);
    this.user.set(null);
    
    // Notify other tabs
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_logout', Date.now().toString());
      localStorage.removeItem('auth_logout');
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
   * Hard reset - clear everything
   */
  hardReset(): void {
    this.clearAuth();
    this.clearTimers();
    this.isInitialized.set(false);
    this.isRefreshing$.next(false);
  }
}