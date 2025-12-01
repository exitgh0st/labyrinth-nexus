import { z } from 'zod';

/**
 * Reusable email validation schema
 */
const emailSchema = z.email('Invalid email address').min(1, 'Email is required');

/**
 * Strong password validation schema with multiple requirements
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Login form validation schema
 * Validates email format and password presence
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Registration form validation schema
 * Includes password strength requirements and confirmation matching
 */
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional().or(z.literal('')),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional().or(z.literal('')),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // Show error on confirmPassword field
});

/**
 * Type inference for login form data
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Type inference for registration form data
 */
export type RegisterInput = z.infer<typeof registerSchema>;
