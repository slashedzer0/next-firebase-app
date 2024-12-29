import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ResultsProps {
  score: number
}

export function Results({ score }: ResultsProps) {
  const roundedScore = Math.round(score * 10) / 10

  const getMessage = (score: number) => {
    if (score < 3) return "Your stress levels appear to be well-managed."
    if (score < 5) return "You're experiencing moderate stress levels."
    if (score < 7) return "Your stress levels are elevated. Consider stress management techniques."
    return "You seem to be experiencing high stress levels, please take care of yourself."
  }

  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">Scan Complete</p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
              Your Score
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground md:max-w-2xl">
              <div className="space-y-2">
                <p className="text-8xl font-semibold text-foreground">{roundedScore}</p>
              </div>
              <p>{getMessage(roundedScore)}</p>
              <p className="text-sm text-center text-muted-foreground italic">MindEase may make mistakes. Please use with discretion.</p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
                <Button onClick={() => alert("Test result saved!")}>
                  Save Result
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

