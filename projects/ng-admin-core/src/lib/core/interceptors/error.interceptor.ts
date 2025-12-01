import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AUTH_CONFIG } from '../../auth/config/auth-config';

/**
 * Global error interceptor for handling HTTP errors
 * Provides centralized error handling and user notifications
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { provideHttpClient, withInterceptors } from '@angular/common/http';
 * import { errorInterceptor } from '@labyrinth/ng-admin-core';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([errorInterceptor])
 *     )
 *   ]
 * };
 * ```
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authConfig = inject(AUTH_CONFIG);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        console.error('Client-side error:', error.error);
      } else {
        // Server-side error
        console.error('Server-side error:', {
          status: error.status,
          message: error.message,
          error: error.error
        });

        switch (error.status) {
          case 0:
            errorMessage = 'Network error. Please check your connection.';
            break;

          case 400:
            errorMessage = error.error?.message || 'Bad request. Please check your input.';
            break;

          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            // Redirect to login page
            const loginRoute = authConfig.routes.login || '/login';
            router.navigate([loginRoute]);
            break;

          case 403:
            errorMessage = 'Forbidden. You don\'t have permission to access this resource.';
            break;

          case 404:
            errorMessage = error.error?.message || 'Resource not found.';
            break;

          case 409:
            errorMessage = error.error?.message || 'Conflict. The resource already exists.';
            break;

          case 422:
            errorMessage = error.error?.message || 'Validation error. Please check your input.';
            break;

          case 429:
            errorMessage = 'Too many requests. Please try again later.';
            break;

          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;

          case 502:
            errorMessage = 'Bad gateway. The server is temporarily unavailable.';
            break;

          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;

          case 504:
            errorMessage = 'Gateway timeout. The request took too long.';
            break;

          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Don't show notification for 401 errors (handled by redirect)
      if (error.status !== 401) {
        notificationService.error(errorMessage);
      }

      // Re-throw the error for component-level handling
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        error: error.error
      }));
    })
  );
};
