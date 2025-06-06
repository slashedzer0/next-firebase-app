'use client';

import { ScanIntro } from './scan-intro';
import { ScanQuestions } from './scan-questions';
import { ScanResults } from './scan-results';
import { useScanStore } from '@/stores/use-scan-store';
import { useAuth } from '@/stores/use-auth-store';
import { useRouter } from 'next/navigation';
import { handleError, toast } from '@/utils';

import { useTranslations } from 'next-intl';

export function ScanMain() {
  const t = useTranslations('ScanPage');
  const {
    step,
    currentQuestion,
    questions,
    result,
    isSaving,
    handleStart,
    handleAnswer,
    handleBack,
    getCurrentAnswer,
    handleSaveResult: saveResult,
  } = useScanStore();

  const user = useAuth((state) => state.user);
  const router = useRouter();

  const handleSaveResult = async () => {
    if (!result) return;

    // Check if user is authenticated
    if (!user) {
      router.push('/login?redirect=/scan');
      return;
    }

    try {
      await saveResult(user.uid, () => {
        // Success notification
        toast.success(t('assessmentSaved'));

        // Correctly redirect based on user role and username
        if (user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          const username = user.username || user.uid;
          router.push(`/dashboard/${username}`);
        }
      });
    } catch (error) {
      handleError(error, 'Failed to save assessment result.');
    }
  };

  return (
    <>
      {step === 'loading' && <ScanResults isLoading />}
      {step === 'results' && result && (
        <ScanResults result={result} onSaveResult={handleSaveResult} isSaving={isSaving} />
      )}
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
    </>
  );
}
