import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * HTTP logging interceptor
 * Logs all HTTP requests and responses for debugging
 *
 * In production, you might want to:
 * 1. Send logs to external service (DataDog, Splunk, etc.)
 * 2. Add request/response filtering for sensitive data
 * 3. Add performance monitoring
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  return next(req).pipe(
    tap(event => {
      // Log successful response
      if (event instanceof HttpResponse) {
        const duration = Date.now() - startTime;
        // TODO: Send to external logging service in production
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Log error response
      const duration = Date.now() - startTime;
      console.error(`[HTTP] ✗ ${req.method} ${req.url} - ${error.status} (${duration}ms)`, {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        error: error.error
      });

      return throwError(() => error);
    })
  );
};
