/**
 * Provider function for configuring the Admin Core library
 * @module core/config
 */

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ADMIN_CORE_CONFIG, AdminCoreConfig } from './tokens';

/**
 * Provides the Admin Core library configuration
 *
 * This function should be called in your application's `ApplicationConfig` providers array.
 *
 * @param config - The configuration object for the library
 * @returns Environment providers for the library
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { ApplicationConfig } from '@angular/core';
 * import { provideRouter } from '@angular/router';
 * import { provideAnimations } from '@angular/platform-browser/animations';
 * import { provideAdminCore } from '@labyrinth/ng-admin-core';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     provideAnimations(),
 *     provideAdminCore({
 *       apiBaseUrl: 'https://api.example.com',
 *       authConfig: {
 *         loginRoute: '/auth/login',
 *         tokenKey: 'my_token'
 *       }
 *     })
 *   ]
 * };
 * ```
 */
export function provideAdminCore(config: AdminCoreConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ADMIN_CORE_CONFIG,
      useValue: {
        ...config,
        authConfig: {
          tokenKey: 'auth_token',
          loginRoute: '/login',
          unauthorizedRoute: '/unauthorized',
          ...config.authConfig,
        },
      },
    },
    // Note: HTTP interceptors should be provided by the consuming app
    // using provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]);
}
