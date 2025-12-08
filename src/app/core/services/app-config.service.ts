import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
  appName: string;
  sessionTimeout: number;
  inactivityTimeout: number;
  refreshBeforeExpiry: number;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private http = inject(HttpClient);
  private config!: AppConfig;

  /**
   * Load application configuration from assets/config/app-config.json
   * This is called during app initialization
   */
  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(
        this.http.get<AppConfig>('/assets/config/app-config.json')
      );
      console.log('App configuration loaded successfully:', this.config);
    } catch (error) {
      console.error('Failed to load app configuration, using defaults:', error);
      // Fallback to default configuration
      this.config = {
        apiUrl: 'http://localhost:3000/api',
        appName: 'Labyrinth Nexus',
        sessionTimeout: 1800000,
        inactivityTimeout: 1800000,
        refreshBeforeExpiry: 120000,
      };
    }
  }

  /**
   * Get the API base URL
   */
  get apiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get the application name
   */
  get appName(): string {
    return this.config.appName;
  }

  /**
   * Get the session timeout in milliseconds
   */
  get sessionTimeout(): number {
    return this.config.sessionTimeout;
  }

  /**
   * Get the inactivity timeout in milliseconds
   */
  get inactivityTimeout(): number {
    return this.config.inactivityTimeout;
  }

  /**
   * Get the refresh before expiry time in milliseconds
   */
  get refreshBeforeExpiry(): number {
    return this.config.refreshBeforeExpiry;
  }

  /**
   * Get the entire configuration object
   */
  getConfig(): AppConfig {
    return this.config;
  }
}
