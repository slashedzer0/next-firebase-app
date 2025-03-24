"use client";

import { useState } from "react";
import { ScanIntro } from "./scan-intro";
import { ScanQuestions } from "./scan-questions";
import { ScanResults } from "./scan-results";
import { ScanLoading } from "./scan-loading";
import { questions } from "@/app/(site)/scan/page";
import { Answer, AssessmentResult } from "@/types/assessment";
import { calculateCF, saveAssessmentResult } from "@/utils";
import { useAuth } from "@/stores/use-auth";
import { useRouter } from "next/navigation";

const LOADING_DURATION = 3000; // 3 seconds

export function ScanMain() {
  const [step, setStep] = useState<
    "intro" | "questions" | "results" | "loading"
  >("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const user = useAuth((state) => state.user); // Access user from Zustand store
  const router = useRouter();

  const handleStart = () => setStep("questions");

  const handleAnswer = (value: number) => {
    // Update or add new answer
    const newAnswers = [...answers];
    const answerValue = value as Answer["value"]; // Type cast to our limited set of values

    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion].id,
      value: answerValue,
    };
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setStep("loading");
      setTimeout(() => {
        const calculatedResult = calculateCF(newAnswers);
        setResult(calculatedResult);
        setStep("results");
      }, LOADING_DURATION);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setStep("intro");
    }
  };

  const handleSaveResult = async () => {
    if (!result) return;

    // Check if user is authenticated
    if (!user) {
      // Redirect to login page if not authenticated
      router.push("/login?redirect=/scan");
      return;
    }

    try {
      setIsSaving(true);
      const userId = user.uid;
      await saveAssessmentResult(userId, answers, result);

      // Use alert instead of toast
      alert(`Assessment saved successfully!`);

      // Correctly redirect based on user role and username
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        // Use the username for the dynamic route
        const username = user.username || userId;
        router.push(`/dashboard/${username}`);
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Failed to save assessment result");
    } finally {
      setIsSaving(false);
    }
  };

  // Get previous answer for current question if it exists
  const getCurrentAnswer = () => {
    const answer = answers[currentQuestion];
    return answer ? answer.value.toString() : "";
  };

  return (
    <>
      {step === "loading" && <ScanLoading />}
      {step === "intro" && <ScanIntro onStart={handleStart} />}
      {step === "questions" && (
        <ScanQuestions
          question={questions[currentQuestion]}
          currentQuestion={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
          initialSelected={getCurrentAnswer()}
        />
      )}
      {step === "results" && result && (
        <ScanResults
          result={result}
          onSaveResult={handleSaveResult}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
