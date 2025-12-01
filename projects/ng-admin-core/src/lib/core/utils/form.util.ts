import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

/**
 * Form utility functions for validation and error handling
 */

/**
 * Mark all controls in a form group as touched
 * @param formGroup - The form group
 */
export function markFormGroupTouched(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.markAsTouched();

    if (control instanceof FormGroup) {
      markFormGroupTouched(control);
    }
  });
}

/**
 * Reset a form group and clear all validation errors
 * @param formGroup - The form group
 */
export function resetFormGroup(formGroup: FormGroup): void {
  formGroup.reset();
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.setErrors(null);
    control?.markAsUntouched();
    control?.markAsPristine();
  });
}

/**
 * Get all validation errors from a form group
 * @param formGroup - The form group
 * @returns Object with control names as keys and error messages as values
 */
export function getFormErrors(formGroup: FormGroup): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    const controlErrors = control?.errors;

    if (controlErrors) {
      errors[key] = Object.keys(controlErrors).map(errorKey => {
        return getErrorMessage(errorKey, controlErrors[errorKey]);
      });
    }

    if (control instanceof FormGroup) {
      const nestedErrors = getFormErrors(control);
      Object.keys(nestedErrors).forEach(nestedKey => {
        errors[`${key}.${nestedKey}`] = nestedErrors[nestedKey];
      });
    }
  });

  return errors;
}

/**
 * Get a user-friendly error message for a validation error
 * @param errorKey - The error key
 * @param errorValue - The error value
 * @returns User-friendly error message
 */
export function getErrorMessage(errorKey: string, errorValue: any): string {
  const errorMessages: Record<string, (value: any) => string> = {
    required: () => 'This field is required',
    email: () => 'Please enter a valid email address',
    minlength: (value) => `Minimum length is ${value.requiredLength} characters`,
    maxlength: (value) => `Maximum length is ${value.requiredLength} characters`,
    min: (value) => `Minimum value is ${value.min}`,
    max: (value) => `Maximum value is ${value.max}`,
    pattern: () => 'Invalid format',
    passwordMismatch: () => 'Passwords do not match',
    zod: (value) => value || 'Validation failed'
  };

  const messageFunc = errorMessages[errorKey];
  return messageFunc ? messageFunc(errorValue) : `Invalid ${errorKey}`;
}

/**
 * Check if a form control has a specific error and has been touched
 * @param control - The form control
 * @param errorKey - The error key to check
 * @returns true if the control has the error and has been touched
 */
export function hasError(control: AbstractControl | null, errorKey: string): boolean {
  return !!(control?.hasError(errorKey) && control?.touched);
}

/**
 * Get the first error message for a control
 * @param control - The form control
 * @returns Error message or empty string
 */
export function getControlError(control: AbstractControl | null): string {
  if (!control || !control.errors || !control.touched) return '';

  const firstErrorKey = Object.keys(control.errors)[0];
  return getErrorMessage(firstErrorKey, control.errors[firstErrorKey]);
}

/**
 * Validate if two form controls have the same value (for password confirmation)
 * @param controlName - The first control name
 * @param matchingControlName - The second control name
 * @returns Validator function
 */
export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}

/**
 * Check if a form is valid and submit-ready
 * @param formGroup - The form group
 * @returns true if form is valid
 */
export function isFormValid(formGroup: FormGroup): boolean {
  if (formGroup.valid) {
    return true;
  }

  markFormGroupTouched(formGroup);
  return false;
}

/**
 * Get form values excluding null and undefined
 * @param formGroup - The form group
 * @returns Form values without null/undefined
 */
export function getFormValues<T = any>(formGroup: FormGroup): Partial<T> {
  const values = formGroup.value;
  const cleanedValues: any = {};

  Object.keys(values).forEach(key => {
    if (values[key] !== null && values[key] !== undefined) {
      cleanedValues[key] = values[key];
    }
  });

  return cleanedValues as Partial<T>;
}
