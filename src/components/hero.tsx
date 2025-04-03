// import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <Link
          href="/scan"
          className="mx-auto mb-4 flex w-fit items-center rounded-full bg-secondary px-4 py-2 text-sm"
        >
          <span className="font-medium">How it works</span>
          <ArrowRight className="ml-2 inline size-4" />
        </Link>

        <h1 className="my-4 mb-6 text-center text-3xl font-semibold tracking-tight md:text-5xl">
          Track your stress levels with ease.
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground">
          A simple way for students to measure, track, and understand their stress levels throughout
          the academic year. Save your scan results and monitor your progress over time.
        </p>

        <div className="flex justify-center">
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full sm:w-auto lg:mt-10"
          >
            Getting Started
          </a>
        </div>

        <div className="mt-6 lg:mt-8">
          <p className="mx-auto max-w-2xl text-center text-sm italic text-muted-foreground">
            Not a substitute for professional mental health support.{' '}
            <Link href="/about" className="underline">
              Click here
            </Link>{' '}
            to learn more.
          </p>
        </div>
      </div>
    </section>
  );
}
