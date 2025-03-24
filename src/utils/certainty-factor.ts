import { Answer, AssessmentResult } from "@/types/assessment";

export function calculateCF(answers: Answer[]): AssessmentResult {
  let MB = 0; // Measure of Belief
  let MD = 0; // Measure of Disbelief

  answers.forEach(({ value }) => {
    if (value > 0) MB += value;
    else MD += Math.abs(value);
  });

  MB = Math.min(1, MB / answers.length);
  MD = Math.min(1, MD / answers.length);

  const CF = MB - MD;
  const confidence = Math.round(((CF + 1) / 2) * 99 + 1); // Scale 1-100%

  let stressLevel: "mild" | "moderate" | "severe";
  if (CF < -0.3) stressLevel = "mild";
  else if (CF < 0.5) stressLevel = "moderate";
  else stressLevel = "severe";

  return { stressLevel, confidence };
}
