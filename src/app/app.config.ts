import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './features/auth/interceptors/auth-interceptors';
import { AuthStore } from './features/auth/services/auth-store';
import { firstValueFrom, tap } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      const authStore = inject(AuthStore);

      // Only run in browser, skip on server
      if (isPlatformBrowser(platformId)) {
        return authStore.initializeAuth();
      }
      
      return Promise.resolve();
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
