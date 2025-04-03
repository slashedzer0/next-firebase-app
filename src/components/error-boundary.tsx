'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Add global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error || new Error(event.message));

      // Log to console or to a service like Sentry
      console.error('Unhandled error:', event.error);
    };

    // Handle promise rejections
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      setError(new Error(`Promise rejection: ${event.reason}`));

      // Log to console or to a service like Sentry
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="w-full max-w-md p-6 bg-background rounded-lg shadow-lg border">
          <h2 className="text-xl font-bold mb-4 text-destructive">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <div className="grid gap-4">
            <Button onClick={() => window.location.reload()} className="w-full">
              Refresh the page
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              className="w-full"
            >
              Go to homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
