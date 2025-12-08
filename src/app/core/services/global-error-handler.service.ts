import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Global error handler for the application
 * Catches all unhandled errors and provides user-friendly feedback
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);

  handleError(error: Error): void {
    console.error('Global error caught:', error);

    // Log error details for debugging
    this.logError(error);

    // Display user-friendly message
    this.displayErrorMessage(error);

    // Redirect to error page for critical errors
    if (this.isCriticalError(error)) {
      this.router.navigate(['/error'], {
        queryParams: { message: this.getUserFriendlyMessage(error) }
      });
    }
  }

  /**
   * Log error to console (in production, send to external service like Sentry)
   */
  private logError(error: Error): void {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.error('Error Details:', errorInfo);

    // TODO: Send to external logging service
    // Example: Sentry.captureException(error);
    // Example: this.loggingService.logError(errorInfo);
  }

  /**
   * Display error message to user
   * In a real app, you might use a snackbar or toast notification
   */
  private displayErrorMessage(error: Error): void {
    const message = this.getUserFriendlyMessage(error);

    // For now, just log to console
    // In production, use MatSnackBar or similar
    console.warn('User-friendly message:', message);

    // Example with MatSnackBar (uncomment if you want to use it):
    // this.snackBar.open(message, 'Close', {
    //   duration: 5000,
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   panelClass: ['error-snackbar']
    // });
  }

  /**
   * Determine if error is critical and requires navigation to error page
   */
  private isCriticalError(error: Error): boolean {
    // ChunkLoadError - lazy loaded module failed to load
    if (error.name === 'ChunkLoadError') {
      return true;
    }

    // Network errors
    if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return true;
    }

    // Module not found errors
    if (error.message.includes('Cannot find module')) {
      return true;
    }

    return false;
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: Error): string {
    // ChunkLoadError - usually caused by deployment while user has old version
    if (error.name === 'ChunkLoadError') {
      return 'A new version of the application is available. Please refresh the page.';
    }

    // Network errors
    if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    // Module not found
    if (error.message.includes('Cannot find module')) {
      return 'A required resource failed to load. Please refresh the page.';
    }

    // Generic error
    return 'An unexpected error occurred. Please try again.';
  }
}
