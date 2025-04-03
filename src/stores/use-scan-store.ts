import { create } from 'zustand';
import { Answer, AssessmentResult, Question } from '@/types/assessment';
import { calculateCF, saveAssessmentResult, shuffleArray } from '@/utils';
import { questions as originalQuestions } from '@/app/(site)/scan/page';

type ScanStep = 'intro' | 'questions' | 'results' | 'loading';

interface ScanStore {
  step: ScanStep;
  setStep: (step: ScanStep) => void;
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  answers: Answer[];
  setAnswers: (answers: Answer[]) => void;
  addAnswer: (questionId: string, value: number) => void;
  result: AssessmentResult | null;
  setResult: (result: AssessmentResult | null) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  questions: Question[];
  shuffleQuestions: () => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  handleStart: () => void;
  handleAnswer: (value: number) => void;
  handleBack: () => void;
  handleSaveResult: (userId: string, onSuccess?: () => void) => Promise<void>;
  getCurrentAnswer: () => string;
  resetScan: () => void;
}

const LOADING_DURATION = 3000; // 3 seconds

export const useScanStore = create<ScanStore>((set, get) => ({
  step: 'intro',
  setStep: (step) => set({ step }),
  currentQuestion: 0,
  setCurrentQuestion: (index) => set({ currentQuestion: index }),
  answers: [],
  setAnswers: (answers) => set({ answers }),
  addAnswer: (questionId, value) => {
    const { currentQuestion, answers } = get();
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId,
      value: value as Answer['value'],
    };
    set({ answers: newAnswers });
  },
  result: null,
  setResult: (result) => set({ result }),
  isSaving: false,
  setIsSaving: (isSaving) => set({ isSaving }),
  questions: [],
  shuffleQuestions: () => set({ questions: shuffleArray([...originalQuestions]) }),
  selectedOption: '',
  setSelectedOption: (option) => set({ selectedOption: option }),

  handleStart: () => {
    set({
      currentQuestion: 0,
      answers: [],
      questions: shuffleArray([...originalQuestions]),
      step: 'questions',
    });
  },

  handleAnswer: (value) => {
    const { currentQuestion, questions, answers } = get();

    // Update or add new answer
    const newAnswers = [...answers];
    const answerValue = value as Answer['value'];

    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion]?.id || '',
      value: answerValue,
    };

    set({ answers: newAnswers });

    if (currentQuestion === questions.length - 1) {
      set({ step: 'loading' });

      // Simulate loading delay
      setTimeout(() => {
        const calculatedResult = calculateCF(newAnswers);
        set({
          result: calculatedResult,
          step: 'results',
        });
      }, LOADING_DURATION);
    } else {
      set({ currentQuestion: currentQuestion + 1 });
    }
  },

  handleBack: () => {
    const { currentQuestion } = get();
    if (currentQuestion > 0) {
      set({ currentQuestion: currentQuestion - 1 });
    } else {
      set({ step: 'intro' });
    }
  },

  handleSaveResult: async (userId, onSuccess) => {
    const { result, answers } = get();
    if (!result) return;

    try {
      set({ isSaving: true });
      await saveAssessmentResult(userId, answers, result);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error; // Re-throw to allow caller to handle
    } finally {
      set({ isSaving: false });
    }
  },

  getCurrentAnswer: () => {
    const { answers, currentQuestion } = get();
    const answer = answers[currentQuestion];
    return answer ? answer.value.toString() : '';
  },

  resetScan: () => {
    set({
      step: 'intro',
      currentQuestion: 0,
      answers: [],
      result: null,
      isSaving: false,
      questions: [],
      selectedOption: '',
    });
  },
}));
