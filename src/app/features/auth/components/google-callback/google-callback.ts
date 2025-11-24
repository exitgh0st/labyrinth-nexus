import { Component, inject, signal } from '@angular/core';
import { OAuthStore } from '../../services/oauth-store';
import { Router } from 'express';

@Component({
  selector: 'app-google-callback',
  imports: [],
  templateUrl: './google-callback.html',
  styleUrl: './google-callback.scss',
})
export class GoogleCallback {
  private oauthStore = inject(OAuthStore);
  private router = inject(Router);

  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const success = await this.oauthStore.handleCallback();
      
      if (!success) {
        this.error.set('Google authentication failed. Please try again.');
        setTimeout(() => this.redirectToLogin(), 3000);
      }
      // If successful, GoogleAuthService will handle navigation
    } catch (err) {
      console.error('Google OAuth callback error:', err);
      this.error.set('An unexpected error occurred. Please try again.');
      setTimeout(() => this.redirectToLogin(), 3000);
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
