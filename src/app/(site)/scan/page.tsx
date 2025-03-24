import { ScanMain } from "./_components/scan-main";
import { Question } from "@/types/assessment";

export const questions: Question[] = [
  { id: "q1", text: "I feel overwhelmed by daily tasks" },
  { id: "q2", text: "I find it difficult to relax" },
  { id: "q3", text: "I experience physical tension or pain" },
  { id: "q4", text: "My sleep pattern is disturbed" },
  { id: "q5", text: "I have trouble concentrating" },
  { id: "q6", text: "I feel irritable or short-tempered" },
  { id: "q7", text: "I worry excessively about things" },
  { id: "q8", text: "I feel tired or have low energy" },
  { id: "q9", text: "I have difficulty making decisions" },
  { id: "q10", text: "I feel pressured by time constraints" },
];

export default function Page() {
  return <ScanMain />;
}
