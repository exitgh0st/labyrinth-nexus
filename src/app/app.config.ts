import {
  ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer, APP_INITIALIZER, ErrorHandler,
  provideBrowserGlobalErrorListeners, provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AppInitializer } from './core/services/app-initializer';
import { authInterceptor, provideAdminCore, provideAuth } from '@labyrinth-team/ng-admin-core';
import { environment } from '../environments/environment';
import { AppConfigService } from './core/services/app-config.service';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

/**
 * Factory function to initialize app configuration
 * This runs before the app starts to load runtime configuration
 */
export function initializeAppConfig(configService: AppConfigService) {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // Load app configuration first (highest priority)
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppConfig,
      deps: [AppConfigService],
      multi: true
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([loggingInterceptor, authInterceptor])
    ),
    // Note: These use environment.apiUrl as fallback
    // In production, update environment.ts to use AppConfigService
    provideAdminCore({
      apiBaseUrl: environment.apiUrl
    }),
    provideAuth({
      token: {
        storage: 'memory',
      },
      session: {
        inactivityTimeout: 30 * 60 * 1000, // 30 minutes (configurable via app-config.json)
        refreshBeforeExpiry: 2 * 60 * 1000, // 2 minutes (configurable via app-config.json)
      },
      routes: {
        afterLogin: '/dashboard',
        afterLogout: '/auth/login',
        login: '/auth/login',
        unauthorized: '/auth/unauthorized',
      }
    }),
    provideAppInitializer(() => {
      const appInitializer = inject(AppInitializer);

      return appInitializer.initialize();
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};
