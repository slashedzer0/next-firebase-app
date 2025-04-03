import { Spinner } from '@/components/spinner';

export function ScanLoading() {
  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
          <Spinner className="size-8" />
          <p className="text-lg text-muted-foreground">Calculating your results...</p>
        </div>
      </div>
    </section>
  );
}
