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
  confirmPassword?: string; // Optional, can validate on frontend
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
  private apiUrl = environment.apiUrl; // Change this

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Refresh token comes back as HTTP-only cookie automatically
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      credentials,
      { withCredentials: true } // Important! Sends cookies
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Refresh token comes back as HTTP-only cookie automatically
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/register`,
      userData,
      { withCredentials: true } // Important! Sends cookies
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
    // Refresh token is sent automatically via HTTP-only cookie
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  // Optional: If you have a "get current user" endpoint
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/auth/me`,
      { withCredentials: true }
    );
  }
}