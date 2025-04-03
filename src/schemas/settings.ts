import * as z from 'zod';

export const settingsFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name is required')
    .regex(/^[a-zA-Z\s]+$/, 'First name must only contain letters and spaces')
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, 'First name cannot be empty'),
  lastName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, 'Last name must only contain letters and spaces')
    .transform((val) => val.trim())
    .optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  nim: z
    .string()
    .regex(/^\d+$/, 'NIM must only contain numbers')
    .min(8, 'NIM must be at least 8 characters')
    .max(20, 'NIM must not exceed 20 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^\d+$/, 'Phone number must only contain numbers')
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must not exceed 20 characters')
    .optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
