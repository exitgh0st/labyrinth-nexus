/**
 * Authentication interceptor for automatic token injection
 * @module auth/interceptors
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AUTH_CONFIG } from '../config/auth-config';

/**
 * Authentication interceptor
 *
 * Automatically adds the Authorization header with access token to outgoing requests.
 * Handles 401 Unauthorized responses by attempting to refresh the token.
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * import { authInterceptor } from '@labyrinth/ng-admin-core/auth';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([authInterceptor])
 *     )
 *   ]
 * };
 * ```
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authConfig = inject(AUTH_CONFIG);

  // Check if this endpoint should skip authentication
  const skipAuth = authConfig.http.skipAuthEndpoints?.some((endpoint) =>
    req.url.includes(endpoint)
  );

  if (skipAuth) {
    return next(req);
  }

  // Get access token
  const token = authService.getAccessToken();

  // Clone request and add authorization header
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `${authConfig.token.headerPrefix || 'Bearer'} ${token}`,
        },
      })
    : req;

  // Handle 401 errors by refreshing token
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        // Attempt to refresh token
        return authService.refreshToken().pipe(
          switchMap((response) => {
            // Retry original request with new token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `${authConfig.token.headerPrefix || 'Bearer'} ${response.accessToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Refresh failed, propagate error
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
