import { z } from 'zod';

/**
 * Role form validation schema
 * Used for both creating and editing roles
 */
export const roleFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters'),
  description: z
    .string()
    .max(255, 'Description must not exceed 255 characters')
    .optional()
    .or(z.literal('')),
  isActive: z
    .boolean()
    .default(true),
});

/**
 * Type inference for role form data
 */
export type RoleFormInput = z.infer<typeof roleFormSchema>;
