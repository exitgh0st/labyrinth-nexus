import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { z, ZodError, ZodSchema } from 'zod';

/**
 * Bridge between Zod validation schemas and Angular Reactive Forms validators.
 * Converts Zod schemas into Angular ValidatorFn for seamless integration.
 *
 * @example
 * ```typescript
 * // Define Zod schema
 * const emailSchema = z.string().email('Invalid email');
 *
 * // Use in Angular form
 * this.form = this.fb.group({
 *   email: ['', ZodValidators.fromZod(emailSchema)]
 * });
 *
 * // For form-level validation
 * this.form = this.fb.group({
 *   password: [''],
 *   confirmPassword: ['']
 * }, {
 *   validators: ZodValidators.formGroup(registerSchema)
 * });
 * ```
 */
export class ZodValidators {
  /**
   * Creates an Angular ValidatorFn from a Zod schema for field-level validation.
   * Validates individual form controls.
   *
   * @param schema - The Zod schema to validate against
   * @returns Angular ValidatorFn that returns validation errors or null
   *
   * @example
   * ```typescript
   * const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
   *
   * this.form = this.fb.group({
   *   password: ['', ZodValidators.fromZod(passwordSchema)]
   * });
   * ```
   */
  static fromZod(schema: ZodSchema): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Skip validation if control is pristine and empty
      if (!control.value && !control.touched) {
        return null;
      }

      try {
        // Validate the control value against the Zod schema
        schema.parse(control.value);
        return null; // Validation passed
      } catch (error) {
        if (error instanceof ZodError) {
          // Convert Zod errors to Angular ValidationErrors format
          const errors: ValidationErrors = {};

          error.issues.forEach((err) => {
            // Use the first error message for this field
            const path = err.path.join('.') || 'zod';
            if (!errors[path]) {
              errors[path] = err.message;
            }
          });

          return errors;
        }

        // Fallback error for non-Zod errors
        return { zod: 'Validation failed' };
      }
    };
  }

  /**
   * Creates an Angular ValidatorFn from a Zod schema for form-level validation.
   * Validates the entire form group, useful for cross-field validation.
   *
   * @param schema - The Zod object schema to validate against
   * @returns Angular ValidatorFn that returns validation errors or null
   *
   * @example
   * ```typescript
   * const registerSchema = z.object({
   *   password: z.string().min(8),
   *   confirmPassword: z.string()
   * }).refine(data => data.password === data.confirmPassword, {
   *   message: "Passwords don't match",
   *   path: ['confirmPassword']
   * });
   *
   * this.form = this.fb.group({
   *   password: [''],
   *   confirmPassword: ['']
   * }, {
   *   validators: ZodValidators.formGroup(registerSchema)
   * });
   * ```
   */
  static formGroup(schema: ZodSchema): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        // Validate the entire form value
        schema.parse(control.value);
        return null; // Validation passed
      } catch (error) {
        if (error instanceof ZodError) {
          // Convert Zod errors to Angular ValidationErrors format
          const errors: ValidationErrors = {};

          error.issues.forEach((err) => {
            // Map errors to their respective fields
            const field = err.path[0] as string;
            if (field && !errors[field]) {
              // Store error on the field itself
              const fieldControl = control.get(field);
              if (fieldControl) {
                errors[field] = err.message;
              }
            }
          });

          return errors;
        }

        // Fallback error for non-Zod errors
        return { form: 'Validation failed' };
      }
    };
  }

  /**
   * Validates form data against a Zod schema and returns typed result.
   * Useful for one-off validation outside of Angular forms.
   *
   * @param schema - The Zod schema to validate against
   * @param data - The data to validate
   * @returns Object with success flag, data (if valid), and errors (if invalid)
   *
   * @example
   * ```typescript
   * const result = ZodValidators.validate(loginSchema, formData);
   * if (result.success) {
   *   // result.data is type-safe
   *   await this.authService.login(result.data);
   * } else {
   *   console.error(result.errors);
   * }
   * ```
   */
  static validate<T>(schema: ZodSchema<T>, data: unknown):
    | { success: true; data: T; errors: null }
    | { success: false; data: null; errors: ValidationErrors } {
    try {
      const validData = schema.parse(data);
      return { success: true, data: validData, errors: null };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrors = {};

        error.issues.forEach((err) => {
          const path = err.path.join('.') || 'zod';
          errors[path] = err.message;
        });

        return { success: false, data: null, errors };
      }

      return { success: false, data: null, errors: { zod: 'Validation failed' } };
    }
  }

  /**
   * Extracts validation errors from a form control for display.
   * Returns the first error message found.
   *
   * @param control - The Angular form control
   * @returns Error message string or empty string if no errors
   *
   * @example
   * ```typescript
   * // In template
   * <mat-error>{{ getError(form.get('email')) }}</mat-error>
   *
   * // In component
   * getError(control: AbstractControl | null): string {
   *   return ZodValidators.getErrorMessage(control);
   * }
   * ```
   */
  static getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    // Return the first error message
    const firstError = Object.values(control.errors)[0];

    if (typeof firstError === 'string') {
      return firstError;
    }

    // Handle Angular built-in validators
    if (control.errors['required']) {
      return 'This field is required';
    }

    if (control.errors['email']) {
      return 'Invalid email address';
    }

    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    }

    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    }

    return 'Invalid input';
  }
}
