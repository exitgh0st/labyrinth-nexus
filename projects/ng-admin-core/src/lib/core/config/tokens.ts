/**
 * Configuration tokens for the library
 * @module core/config
 */

import { InjectionToken } from '@angular/core';

/**
 * Configuration interface for the Admin Core library
 */
export interface AdminCoreConfig {
  /**
   * Base URL for API requests
   * @example 'https://api.example.com'
   */
  apiBaseUrl: string;

  /**
   * Authentication configuration
   */
  authConfig?: {
    /**
     * Local storage key for storing auth token
     * @default 'auth_token'
     */
    tokenKey?: string;

    /**
     * Route to redirect to when user is not authenticated
     * @default '/login'
     */
    loginRoute?: string;

    /**
     * Route to redirect to when user is unauthorized (403)
     * @default '/unauthorized'
     */
    unauthorizedRoute?: string;
  };

  /**
   * Custom validation error messages
   * Map of error keys to error messages
   * @example { 'required': 'This field is required', 'email': 'Invalid email format' }
   */
  validationMessages?: Record<string, string>;
}

/**
 * Injection token for Admin Core configuration
 * Use this token to inject the configuration in your services
 *
 * @example
 * ```typescript
 * constructor(@Inject(ADMIN_CORE_CONFIG) private config: AdminCoreConfig) {}
 * ```
 */
export const ADMIN_CORE_CONFIG = new InjectionToken<AdminCoreConfig>(
  'ADMIN_CORE_CONFIG',
  {
    providedIn: 'root',
    factory: () => ({
      apiBaseUrl: '',
      authConfig: {
        tokenKey: 'auth_token',
        loginRoute: '/login',
        unauthorizedRoute: '/unauthorized',
      },
    }),
  }
);
