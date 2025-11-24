import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthApi } from './auth-api';
import { AuthStore } from './auth-store';

@Injectable({
  providedIn: 'root'
})
export class OAuthStore {
  private authApi = inject(AuthApi);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly OAUTH_STATE_KEY = 'google_oauth_state';
  private readonly OAUTH_RETURN_URL_KEY = 'google_oauth_return_url';

  /**
   * Initiates Google OAuth flow by redirecting to Google
   * @param returnUrl - Optional URL to redirect to after successful auth
   */
  initiateGoogleAuth(returnUrl: string = '/home'): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Google OAuth is only available in browser environment');
      return;
    }

    // Generate and store state for CSRF protection
    const state = this.generateState();
    this.saveOAuthState(state, returnUrl);

    // Construct OAuth URL with state parameter
    const oauthUrl = `${this.authApi.getGoogleOAuthUrl()}?state=${state}`;
    
    // Redirect to Google OAuth
    window.location.href = oauthUrl;
  }

  /**
   * Handles OAuth callback after redirect from Google
   * Call this in your callback component/route
   */
  async handleCallback(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    try {
      // Verify state to prevent CSRF attacks
      const urlParams = new URLSearchParams(window.location.search);
      const returnedState = urlParams.get('state');
      const storedState = this.getStoredState();

      if (!returnedState || returnedState !== storedState) {
        console.error('OAuth state mismatch - possible CSRF attack');
        this.clearOAuthData();
        return false;
      }

      // Get auth data from backend (backend should have set cookies)
      const response = await this.authStore.handleOAuthLogin();
      
      if (response) {
        // Get return URL or default to home
        const returnUrl = this.getReturnUrl();
        this.clearOAuthData();
        
        await this.router.navigate([returnUrl]);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Google OAuth callback handling failed:', error);
      this.clearOAuthData();
      return false;
    }
  }

  /**
   * Generates a random state string for CSRF protection
   */
  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Saves OAuth state and return URL to sessionStorage
   */
  private saveOAuthState(state: string, returnUrl: string): void {
    try {
      sessionStorage.setItem(this.OAUTH_STATE_KEY, state);
      sessionStorage.setItem(this.OAUTH_RETURN_URL_KEY, returnUrl);
    } catch (error) {
      console.error('Failed to save OAuth state:', error);
    }
  }

  /**
   * Retrieves stored OAuth state
   */
  private getStoredState(): string | null {
    try {
      return sessionStorage.getItem(this.OAUTH_STATE_KEY);
    } catch (error) {
      console.error('Failed to retrieve OAuth state:', error);
      return null;
    }
  }

  /**
   * Retrieves stored return URL
   */
  private getReturnUrl(): string {
    try {
      return sessionStorage.getItem(this.OAUTH_RETURN_URL_KEY) || '/home';
    } catch (error) {
      console.error('Failed to retrieve return URL:', error);
      return '/home';
    }
  }

  /**
   * Clears OAuth-related data from storage
   */
  private clearOAuthData(): void {
    try {
      sessionStorage.removeItem(this.OAUTH_STATE_KEY);
      sessionStorage.removeItem(this.OAUTH_RETURN_URL_KEY);
    } catch (error) {
      console.error('Failed to clear OAuth data:', error);
    }
  }
}