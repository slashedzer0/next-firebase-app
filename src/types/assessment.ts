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

// Scan component props
export interface ScanIntroProps {
  onStart: () => void;
}

export interface ScanQuestionsProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
  onBack: () => void;
  initialSelected: string;
}

export interface ScanResultsProps {
  result: AssessmentResult;
  onSaveResult: () => Promise<void>;
  isSaving: boolean;
}
