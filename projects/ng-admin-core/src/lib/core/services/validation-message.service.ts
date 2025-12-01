import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Service for extracting and formatting validation error messages from form controls.
 * Provides consistent error message display across the application.
 *
 * Handles both:
 * - Zod validation errors (custom messages from schemas)
 * - Angular built-in validator errors (required, email, minlength, etc.)
 *
 * @example
 * ```typescript
 * // In component
 * export class MyComponent {
 *   validationService = inject(ValidationMessageService);
 *
 *   getError(fieldName: string): string {
 *     const control = this.form.get(fieldName);
 *     return this.validationService.getErrorMessage(control);
 *   }
 * }
 *
 * // In template
 * <mat-form-field>
 *   <mat-label>Email</mat-label>
 *   <input matInput formControlName="email">
 *   <mat-error>{{ getError('email') }}</mat-error>
 * </mat-form-field>
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {

  /**
   * Gets the first error message from a form control.
   * Returns empty string if no errors or control is not touched.
   *
   * @param control - The form control to check for errors
   * @returns Human-readable error message or empty string
   */
  getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    // Zod errors - custom messages are stored directly
    // Check for string values first (Zod custom messages)
    const firstErrorValue = Object.values(errors)[0];
    if (typeof firstErrorValue === 'string') {
      return firstErrorValue;
    }

    // Angular built-in validators
    if (errors['required']) {
      return 'This field is required';
    }

    if (errors['email']) {
      return 'Invalid email address';
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      const actualLength = errors['minlength'].actualLength;
      return `Minimum ${requiredLength} characters (current: ${actualLength})`;
    }

    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      const actualLength = errors['maxlength'].actualLength;
      return `Maximum ${requiredLength} characters (current: ${actualLength})`;
    }

    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }

    if (errors['pattern']) {
      return 'Invalid format';
    }

    if (errors['passwordMismatch']) {
      return "Passwords don't match";
    }

    // Fallback for unknown error types
    return 'Invalid input';
  }

  /**
   * Checks if a form control has any errors and has been touched.
   * Useful for conditional styling or display logic.
   *
   * @param control - The form control to check
   * @returns True if control has errors and has been touched
   *
   * @example
   * ```typescript
   * // In template for conditional classes
   * <input
   *   [class.error]="validationService.hasError(form.get('email'))"
   *   formControlName="email">
   * ```
   */
  hasError(control: AbstractControl | null): boolean {
    return !!(control && control.errors && control.touched);
  }

  /**
   * Gets all error messages from a form control as an array.
   * Useful when you want to display multiple errors.
   *
   * @param control - The form control to check for errors
   * @returns Array of error messages
   *
   * @example
   * ```typescript
   * // Display all errors
   * const errors = this.validationService.getAllErrors(control);
   * errors.forEach(error => console.log(error));
   * ```
   */
  getAllErrors(control: AbstractControl | null): string[] {
    if (!control || !control.errors || !control.touched) {
      return [];
    }

    const errorMessages: string[] = [];
    const errors = control.errors;

    Object.keys(errors).forEach(errorKey => {
      const errorValue = errors[errorKey];

      // Handle string error values (Zod custom messages)
      if (typeof errorValue === 'string') {
        errorMessages.push(errorValue);
        return;
      }

      // Handle Angular built-in validators
      switch (errorKey) {
        case 'required':
          errorMessages.push('This field is required');
          break;
        case 'email':
          errorMessages.push('Invalid email address');
          break;
        case 'minlength':
          errorMessages.push(`Minimum ${errorValue.requiredLength} characters`);
          break;
        case 'maxlength':
          errorMessages.push(`Maximum ${errorValue.requiredLength} characters`);
          break;
        case 'min':
          errorMessages.push(`Minimum value is ${errorValue.min}`);
          break;
        case 'max':
          errorMessages.push(`Maximum value is ${errorValue.max}`);
          break;
        case 'pattern':
          errorMessages.push('Invalid format');
          break;
        case 'passwordMismatch':
          errorMessages.push("Passwords don't match");
          break;
        default:
          errorMessages.push('Invalid input');
      }
    });

    return errorMessages;
  }

  /**
   * Checks if a specific error exists on a control.
   * Useful for custom logic based on error type.
   *
   * @param control - The form control to check
   * @param errorKey - The specific error key to check for
   * @returns True if the control has the specified error
   *
   * @example
   * ```typescript
   * if (this.validationService.hasSpecificError(control, 'required')) {
   *   // Handle required error specifically
   * }
   * ```
   */
  hasSpecificError(control: AbstractControl | null, errorKey: string): boolean {
    return !!(control && control.errors && control.errors[errorKey] && control.touched);
  }
}
