import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../services/auth-store';
import { catchError, switchMap, throwError, retry, timer } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  
  // Skip auth header for auth endpoints
  if (req.url.includes('/auth/login') || 
      req.url.includes('/auth/register') || 
      req.url.includes('/auth/refresh')) {
    return next(req.clone({ withCredentials: true }));
  }

  const token = authStore.getAccessToken();
  
  // Clone request with auth header and credentials
  const authReq = token 
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
    : req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        console.log('401 error detected, attempting token refresh...');
        
        return authStore.refreshAccessToken().pipe(
          switchMap(newToken => {
            // Retry the original request with new token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
              withCredentials: true
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
            console.error('Token refresh failed, logging out');
            authStore.logout().subscribe();
            return throwError(() => refreshError);
          })
        );
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        console.error('Access forbidden - insufficient permissions');
      }

      // Handle network errors with retry
      if (error.status === 0 || error.status >= 500) {
        return timer(1000).pipe(
          switchMap(() => next(authReq)),
          retry({ count: 2, delay: 1000 })
        );
      }

      return throwError(() => error);
    })
  );
};
