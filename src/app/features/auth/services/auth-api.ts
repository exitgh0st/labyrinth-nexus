import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../user/models/user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      credentials,
      { withCredentials: true }
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/register`,
      userData,
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/auth/me`,
      { withCredentials: true }
    );
  }

  /**
   * Get Google OAuth authorization URL
   * This doesn't make an HTTP request - just constructs the URL
   */
  getGoogleOAuthUrl(): string {
    return `${this.apiUrl}/auth/oauth/google`;
  }

  /**
   * Exchange OAuth code/state for access token
   * Call this after OAuth redirect callback
   */
  handleOAuthCallback(): Observable<AuthResponse> {
    // The backend should set the tokens via cookies after OAuth success
    // This endpoint retrieves the auth data after redirect
    return this.http.get<AuthResponse>(
      `${this.apiUrl}/auth/oauth/callback`,
      { withCredentials: true }
    );
  }
}