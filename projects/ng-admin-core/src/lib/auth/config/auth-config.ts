/**
 * Auth module configuration
 * @module auth/config
 */

import { InjectionToken } from '@angular/core';

/**
 * Authentication configuration options
 */
export interface AuthConfig {
  /**
   * API endpoints configuration
   */
  endpoints: {
    /** Login endpoint */
    login: string;
    /** Registration endpoint */
    register: string;
    /** Logout endpoint */
    logout: string;
    /** Token refresh endpoint */
    refresh: string;
    /** Get current user endpoint */
    me: string;
    /** OAuth endpoints */
    oauth?: {
      google?: string;
      github?: string;
      facebook?: string;
      [key: string]: string | undefined;
    };
  };

  /**
   * Token storage configuration
   */
  token: {
    /** Where to store the access token */
    storage?: 'localStorage' | 'sessionStorage' | 'memory';
    /** Access token storage key */
    accessTokenKey?: string;
    /** Refresh token storage key (if not using httpOnly cookies) */
    refreshTokenKey?: string;
    /** Authorization header prefix */
    headerPrefix?: string;
  };

  /**
   * Session configuration
   */
  session: {
    /** Auto-refresh token before expiry (in milliseconds) */
    refreshBeforeExpiry?: number;
    /** Inactivity timeout (in milliseconds) */
    inactivityTimeout?: number;
    /** Enable cross-tab synchronization */
    enableCrossTabSync?: boolean;
  };

  /**
   * Routing configuration
   */
  routes: {
    /** Route to redirect after login */
    afterLogin?: string;
    /** Route to redirect after logout */
    afterLogout?: string;
    /** Route to redirect when unauthorized */
    unauthorized?: string;
    /** Route to redirect when unauthenticated */
    login?: string;
  };

  /**
   * HTTP configuration
   */
  http: {
    /** Send credentials with requests */
    withCredentials?: boolean;
    /** Endpoints that don't require authentication */
    skipAuthEndpoints?: string[];
  };
}

/**
 * Default authentication configuration
 */
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  endpoints: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    oauth: {
      google: '/auth/oauth/google',
      github: '/auth/oauth/github',
    },
  },
  token: {
    storage: 'memory', // Most secure - tokens not persisted
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    headerPrefix: 'Bearer',
  },
  session: {
    refreshBeforeExpiry: 2 * 60 * 1000, // 2 minutes
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    enableCrossTabSync: true,
  },
  routes: {
    afterLogin: '/',
    afterLogout: '/login',
    unauthorized: '/unauthorized',
    login: '/login',
  },
  http: {
    withCredentials: true, // For cookie-based auth
    skipAuthEndpoints: ['/auth/login', '/auth/register', '/auth/refresh'],
  },
};

/**
 * Injection token for auth configuration
 */
export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_AUTH_CONFIG,
});

/**
 * Helper function to merge partial config with defaults
 */
export function mergeAuthConfig(config: Partial<AuthConfig>): AuthConfig {
  return {
    endpoints: { ...DEFAULT_AUTH_CONFIG.endpoints, ...config.endpoints },
    token: { ...DEFAULT_AUTH_CONFIG.token, ...config.token },
    session: { ...DEFAULT_AUTH_CONFIG.session, ...config.session },
    routes: { ...DEFAULT_AUTH_CONFIG.routes, ...config.routes },
    http: { ...DEFAULT_AUTH_CONFIG.http, ...config.http },
  };
}
