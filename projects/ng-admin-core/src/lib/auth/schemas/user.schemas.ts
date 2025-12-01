import { z } from 'zod';

/**
 * User form validation schema
 * Handles both create and edit modes with dynamic password validation
 */
export const userFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  firstName: z
    .string()
    .optional(),
  lastName: z
    .string()
    .optional(),
  displayName: z
    .string()
    .optional(),
  avatarUrl: z
    .url('Avatar URL must be a valid URL')
    .or(z.literal(''))
    .optional(),
  isActive: z
    .boolean()
    .default(true),
  roleIds: z
    .array(z.number())
    .min(1, 'Please select at least one role'),
  password: z
    .string()
    .optional(),
  confirmPassword: z
    .string()
    .optional(),
});

/**
 * User creation schema with required passwords
 */
export const userCreateSchema = userFormSchema
  .omit({ password: true, confirmPassword: true })
  .extend({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * User edit schema with optional passwords
 */
export const userEditSchema = userFormSchema
  .omit({ password: true, confirmPassword: true })
  .extend({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .optional()
      .or(z.literal('')),
    confirmPassword: z
      .string()
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // Only validate password match if password is provided
      if (data.password && data.password !== '') {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

/**
 * Type inference for user form data
 */
export type UserFormInput = z.infer<typeof userFormSchema>;

/**
 * Type inference for user creation data
 */
export type UserCreateInput = z.infer<typeof userCreateSchema>;

/**
 * Type inference for user edit data
 */
export type UserEditInput = z.infer<typeof userEditSchema>;
