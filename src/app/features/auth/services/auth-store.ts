import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError, throwError, BehaviorSubject, Observable, filter, switchMap, take, of, firstValueFrom } from 'rxjs';
import { AuthApi, AuthResponse, LoginRequest, RegisterRequest } from './auth-api';
import { User } from '../../user/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authApi = inject(AuthApi);
  private router = inject(Router);

  // 🔥 In-memory storage using Angular signals
  private accessToken = signal<string | null>(null);
  user = signal<User | null>(null);
  private isInitialized = signal(false);

  // Track if a refresh is in progress to prevent multiple simultaneous refreshes
  private isRefreshing$ = new BehaviorSubject<boolean>(false);

  // Public read-only computed signals
  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = computed(() => this.accessToken() !== null && this.user() !== null);

  /**
   * Login user with credentials
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.authApi.login(credentials).pipe(
      tap(response => {
        this.setAuth(response);
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
   * Logout user and clear all auth data
   */
  logout(): Observable<void> {
    return this.authApi.logout().pipe(
      tap(() => {
        console.log('Logout successful');
        this.clearAuth();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        // Even if logout fails on backend, clear local state
        console.error('Logout error:', error);
        this.clearAuth();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh the access token using the HTTP-only refresh cookie
   * Prevents multiple simultaneous refresh calls
   */
  refreshAccessToken(): Observable<string> {
    return this.authApi.refreshToken().pipe(
      tap(response => {
        console.log('Access token refreshed successfully');
        this.accessToken.set(response.accessToken);
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

        // Refresh failed, user needs to log in again
        this.clearAuth();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current access token from memory
   */
  getAccessToken(): string | null {
    return this.accessToken();
  }

  async initializeAuth(): Promise<void>{
    if (this.isInitialized()) {
      return;
    }
  

    try {
      const response = await firstValueFrom(this.authApi.refreshToken());
      this.accessToken.set(response.accessToken);
      this.user.set(response.user);
    } catch(error) {
      console.log(error);
      return;
    } finally {
      this.isInitialized.set(true)
    }
  }

  /**
   * Check if user has a specific role (if your backend provides roles)
   */
  hasRole(role: string): boolean {
    const user = this.user();
    // Adjust based on your user object structure
    return user?.roles?.some(r => r.name === role) ?? false;
  }

  /**
   * Update user profile data
   */
  updateUser(userData: Partial<User>): void {
    const currentUser = this.user();
    if (currentUser) {
      this.user.set({ ...currentUser, ...userData });
    }
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
   * Clear all authentication data
   */
  private clearAuth(): void {
    this.accessToken.set(null);
    this.user.set(null);
    // Don't reset isInitialized - we want to know we've tried
  }

  /**
   * Force clear everything including initialized state
   * Use this only in special cases like forced logout
   */
  hardReset(): void {
    this.clearAuth();
    this.isInitialized.set(false);
    this.isRefreshing$.next(false);
  }
}