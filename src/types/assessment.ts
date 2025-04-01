export type Question = {
  id: string;
  text: string;
};

export type Answer = {
  questionId: string;
  value: -1 | -0.8 | -0.6 | -0.4 | 0 | 0.4 | 0.6 | 0.8 | 1; // Certainty factor weights
};

export type AssessmentResult = {
  stressLevel: 'mild' | 'moderate' | 'severe';
  confidence: number;
};

// You can now import the comprehensive Assessment type from schemas
// import { Assessment } from "@/schemas/assessment";
