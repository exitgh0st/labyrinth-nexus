import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * Options for confirmation dialogs
 */
export interface ConfirmOptions {
  /** Dialog title */
  title: string;
  /** Optional dialog message/text */
  text?: string;
  /** Icon type to display */
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  /** Text for the confirm button (default: 'Yes') */
  confirmButtonText?: string;
  /** Text for the cancel button (default: 'Cancel') */
  cancelButtonText?: string;
}

/**
 * Service for displaying modal dialogs and confirmations.
 * Wraps SweetAlert2 for consistent dialog styling and behavior across the application.
 *
 * This service is used for:
 * - Delete confirmations
 * - Success/error messages
 * - User confirmations
 *
 * @example
 * ```typescript
 * // Confirmation dialog
 * const confirmed = await this.dialogService.confirm({
 *   title: 'Are you sure?',
 *   text: 'This action cannot be undone',
 *   icon: 'warning'
 * });
 * if (confirmed) {
 *   // Proceed with action
 * }
 *
 * // Success message
 * await this.dialogService.success('User created successfully');
 *
 * // Error message
 * await this.dialogService.error('Failed to delete user');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  /**
   * Shows a confirmation dialog with Yes/Cancel buttons
   * @param options - Configuration options for the dialog
   * @returns Promise that resolves to true if user clicked Yes, false otherwise
   */
  async confirm(options: ConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon || 'warning',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Yes',
      cancelButtonText: options.cancelButtonText || 'Cancel',
      confirmButtonColor: '#3b82f6', // Primary color (blue)
      cancelButtonColor: '#6b7280', // Gray
      heightAuto: false, // Prevents body scroll issues
      reverseButtons: true, // Cancel on left, Confirm on right
    });

    return result.isConfirmed;
  }

  /**
   * Shows a success message dialog
   * @param title - Success message title
   * @param text - Optional additional text
   * @param timer - Auto-close timer in milliseconds (default: 2000)
   * @returns Promise that resolves when dialog is closed
   */
  async success(title: string, text?: string, timer = 2000): Promise<void> {
    await Swal.fire({
      title,
      text,
      icon: 'success',
      timer,
      showConfirmButton: false,
      heightAuto: false,
    });
  }

  /**
   * Shows an error message dialog
   * @param title - Error message title
   * @param text - Optional additional error details
   * @returns Promise that resolves when dialog is closed
   */
  async error(title: string, text?: string): Promise<void> {
    await Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      heightAuto: false,
    });
  }

  /**
   * Shows an info message dialog
   * @param title - Info message title
   * @param text - Optional additional text
   * @returns Promise that resolves when dialog is closed
   */
  async info(title: string, text?: string): Promise<void> {
    await Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      heightAuto: false,
    });
  }

  /**
   * Shows a warning message dialog
   * @param title - Warning message title
   * @param text - Optional additional text
   * @returns Promise that resolves when dialog is closed
   */
  async warning(title: string, text?: string): Promise<void> {
    await Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      heightAuto: false,
    });
  }
}
