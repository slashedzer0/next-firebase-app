import { ScanMain } from "@/components/scan-main"

type Question = {
  id: number
  text: string
}

type Answer = {
  questionId: number
  value: number
}

export const questions: Question[] = [
  { id: 1, text: "I feel overwhelmed by daily tasks" },
  { id: 2, text: "I find it difficult to relax" },
  { id: 3, text: "I experience physical tension or pain" },
  { id: 4, text: "My sleep pattern is disturbed" },
  { id: 5, text: "I have trouble concentrating" },
  { id: 6, text: "I feel irritable or short-tempered" },
  { id: 7, text: "I worry excessively about things" },
  { id: 8, text: "I feel tired or have low energy" },
  { id: 9, text: "I have difficulty making decisions" },
  { id: 10, text: "I feel pressured by time constraints" },
]

export default function Page() {
  return <ScanMain />
}

