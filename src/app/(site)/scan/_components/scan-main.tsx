"use client"

import { useState } from "react"
import { ScanIntro } from "./scan-intro"
import { ScanQuestions } from "./scan-questions"
import { ScanResults } from "./scan-results"
import { ScanLoading } from "./scan-loading"
import { questions } from "@/app/(site)/scan/page"

export function ScanMain() {
  const [step, setStep] = useState<"intro" | "questions" | "results" | "loading">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: number; value: number }>>([])

  const handleStart = () => setStep("questions")

  const handleAnswer = (value: number) => {
    // Update or add new answer
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion].id,
      value
    }
    setAnswers(newAnswers)

    if (currentQuestion === questions.length - 1) {
      setStep("loading")
      setTimeout(() => {
        setStep("results")
      }, 3000)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      setStep("intro")
    }
  }

  const calculateScore = () => {
    const total = answers.reduce((sum, answer) => sum + answer.value, 0)
    return (total / (questions.length * 4)) * 10
  }

  // Get previous answer for current question if it exists
  const getCurrentAnswer = () => {
    const answer = answers[currentQuestion]
    return answer ? answer.value.toString() : ""
  }

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
      {step === "results" && <ScanResults score={calculateScore()} />}
    </>
  )
}

