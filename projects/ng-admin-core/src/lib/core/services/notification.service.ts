import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Service for displaying toast notifications using Material Snackbar.
 * Provides consistent notification styling and behavior across the application.
 *
 * Used for:
 * - Quick feedback messages
 * - Operation success/error notifications
 * - Non-blocking informational messages
 *
 * @example
 * ```typescript
 * // Success notification
 * this.notificationService.success('User created successfully');
 *
 * // Error notification
 * this.notificationService.error('Failed to delete user');
 *
 * // Info notification
 * this.notificationService.info('Processing your request...');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  /**
   * Default configuration for snackbar notifications
   */
  private readonly defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  /**
   * Shows a success notification
   * @param message - Success message to display
   * @param action - Optional action button text (default: 'Close')
   * @param duration - Display duration in milliseconds (default: 3000)
   */
  success(message: string, action = 'Close', duration = 3000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success'],
    });
  }

  /**
   * Shows an error notification
   * @param message - Error message to display
   * @param action - Optional action button text (default: 'Close')
   * @param duration - Display duration in milliseconds (default: 5000, longer for errors)
   */
  error(message: string, action = 'Close', duration = 5000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error'],
    });
  }

  /**
   * Shows an info notification
   * @param message - Info message to display
   * @param action - Optional action button text (default: 'Close')
   * @param duration - Display duration in milliseconds (default: 3000)
   */
  info(message: string, action = 'Close', duration = 3000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-info'],
    });
  }

  /**
   * Shows a warning notification
   * @param message - Warning message to display
   * @param action - Optional action button text (default: 'Close')
   * @param duration - Display duration in milliseconds (default: 4000)
   */
  warning(message: string, action = 'Close', duration = 4000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning'],
    });
  }

  /**
   * Shows a custom notification with full control over configuration
   * @param message - Message to display
   * @param action - Optional action button text
   * @param config - Custom MatSnackBarConfig
   */
  custom(message: string, action = 'Close', config: MatSnackBarConfig = {}): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config,
    });
  }

  /**
   * Dismisses the currently displayed snackbar
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
