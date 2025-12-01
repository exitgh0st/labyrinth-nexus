/**
 * Provider function for auth module
 * @module auth
 */

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AUTH_CONFIG, AuthConfig, mergeAuthConfig } from './auth-config';

/**
 * Provides authentication and authorization functionality
 *
 * @param config - Partial auth configuration (will be merged with defaults)
 * @returns Environment providers for the auth module
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { ApplicationConfig } from '@angular/core';
 * import { provideRouter } from '@angular/router';
 * import { provideAnimations } from '@angular/platform-browser/animations';
 * import { provideAdminCore } from '@labyrinth/ng-admin-core';
 * import { provideAuth } from '@labyrinth/ng-admin-core/auth';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     provideAnimations(),
 *     provideAdminCore({
 *       apiBaseUrl: 'https://api.example.com'
 *     }),
 *     provideAuth({
 *       token: {
 *         storage: 'localStorage', // or 'sessionStorage', 'memory'
 *       },
 *       session: {
 *         inactivityTimeout: 30 * 60 * 1000, // 30 minutes
 *         refreshBeforeExpiry: 2 * 60 * 1000, // 2 minutes
 *       },
 *       routes: {
 *         afterLogin: '/dashboard',
 *         afterLogout: '/login',
 *       }
 *     })
 *   ]
 * };
 * ```
 */
export function provideAuth(config: Partial<AuthConfig> = {}): EnvironmentProviders {
  const mergedConfig = mergeAuthConfig(config);

  return makeEnvironmentProviders([
    {
      provide: AUTH_CONFIG,
      useValue: mergedConfig,
    },
  ]);
}
