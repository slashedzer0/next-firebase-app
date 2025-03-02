import * as z from "zod";

export const settingsFormSchema = z.object({
  firstName: z.string().min(0).optional(),
  lastName: z.string().min(0).optional(),
  email: z.string().optional(),
  nim: z.string().min(0).min(8).optional(),
  phone: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;