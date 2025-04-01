import * as z from 'zod';

export const assessmentSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  userId: z.string().nullable(), // User who took the assessment
  stressLevel: z.enum(['mild', 'moderate', 'severe']),
  confidence: z.number().int().min(1).max(100), // CF percentage (1-100)
  date: z.string(), // Date in DD-MM-YYYY format
  day: z.string().optional(),
  createdAt: z.any(), // To support both Timestamp and Date objects
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.union([
        z.literal(-1),
        z.literal(-0.8),
        z.literal(-0.6),
        z.literal(-0.4),
        z.literal(0),
        z.literal(0.4),
        z.literal(0.6),
        z.literal(0.8),
        z.literal(1),
      ]),
    })
  ),
});

// Schema for retrieving assessments
export const assessmentResponseSchema = assessmentSchema;

export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentResponse = z.infer<typeof assessmentResponseSchema>;
