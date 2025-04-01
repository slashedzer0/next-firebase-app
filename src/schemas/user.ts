import * as z from 'zod';

export const userSchema = z.object({
  userId: z.string(),
  username: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'student']).default('student'),
  status: z.enum(['active', 'inactive']).default('active'),
  nim: z.string().optional(),
  phone: z.string().optional(),
  photoURL: z.string().optional(),
  createdAt: z.date().or(z.string()),
  lastActive: z.date().or(z.string()),
  assessmentCount: z.number().default(0),
});

export type UserData = z.infer<typeof userSchema>;
