'use client';

import { useState } from 'react';
import { ScanIntro } from './scan-intro';
import { ScanQuestions } from './scan-questions';
import { ScanResults } from './scan-results';
import { ScanLoading } from './scan-loading';
import { questions as originalQuestions } from '@/app/(site)/scan/page';
import { Answer, AssessmentResult, Question } from '@/types/assessment';
import { calculateCF, saveAssessmentResult } from '@/utils';
import { useAuth } from '@/stores/use-auth';
import { useRouter } from 'next/navigation';

const LOADING_DURATION = 3000; // 3 seconds

// Fisher-Yates shuffle algorithm for randomizing questions
const shuffleQuestions = (array: Question[]): Question[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function ScanMain() {
  const [step, setStep] = useState<'intro' | 'questions' | 'results' | 'loading'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const user = useAuth((state) => state.user);
  const router = useRouter();

  const handleStart = () => {
    // Shuffle questions each time the assessment starts
    setQuestions(shuffleQuestions(originalQuestions));
    setCurrentQuestion(0);
    setAnswers([]);
    setStep('questions');
  };

  const handleAnswer = (value: number) => {
    // Update or add new answer
    const newAnswers = [...answers];
    const answerValue = value as Answer['value'];

    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion].id, // Use shuffled questions array
      value: answerValue,
    };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setStep('loading');
      setTimeout(() => {
        const calculatedResult = calculateCF(newAnswers);
        setResult(calculatedResult);
        setStep('results');
      }, LOADING_DURATION);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setStep('intro');
    }
  };

  const handleSaveResult = async () => {
    if (!result) return;

    // Check if user is authenticated
    if (!user) {
      router.push('/login?redirect=/scan');
      return;
    }

    try {
      setIsSaving(true);
      const userId = user.uid;
      await saveAssessmentResult(userId, answers, result);
      alert(`Assessment saved successfully!`);

      // Correctly redirect based on user role and username
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        const username = user.username || userId;
        router.push(`/dashboard/${username}`);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment result');
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentAnswer = () => {
    const answer = answers[currentQuestion];
    return answer ? answer.value.toString() : '';
  };

  return (
    <>
      {step === 'loading' && <ScanLoading />}
      {step === 'intro' && <ScanIntro onStart={handleStart} />}
      {step === 'questions' && questions.length > 0 && (
        <ScanQuestions
          question={questions[currentQuestion]}
          currentQuestion={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
          initialSelected={getCurrentAnswer()}
        />
      )}
      {step === 'results' && result && (
        <ScanResults result={result} onSaveResult={handleSaveResult} isSaving={isSaving} />
      )}
    </>
  );
}
