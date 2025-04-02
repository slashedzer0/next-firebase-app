import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScanResultsProps } from '@/types/assessment';
import { Loader2, Save, LogIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/stores/use-auth';

// Add the LevelBadge component
function LevelBadge({ level }: { level: string }) {
  switch (level) {
    case 'Mild':
      return (
        <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
          {level}
        </Badge>
      );
    case 'Moderate':
      return (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          {level}
        </Badge>
      );
    case 'Severe':
      return (
        <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
          {level}
        </Badge>
      );
    default:
      return null;
  }
}

export function ScanResults({ result, onSaveResult, isSaving }: ScanResultsProps) {
  const user = useAuth((state) => state.user);
  const isAuthenticated = !!user;

  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const getMessage = (level: string) => {
    if (level === 'mild') return 'Your stress levels appear to be well-managed.';
    if (level === 'moderate')
      return "You're experiencing moderate stress levels. Consider basic stress management techniques.";
    return 'Your stress levels are severe. Professional support is recommended.';
  };

  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">
              Scan Complete
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">Your Results</h2>
            <div className="space-y-6 text-lg text-muted-foreground md:max-w-2xl">
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground">
                    {result.confidence}%
                  </p>
                  <LevelBadge level={capitalizeFirst(result.stressLevel)} />
                </div>
              </div>

              <p>{getMessage(result.stressLevel)}</p>
              <p className="text-sm text-center text-muted-foreground italic">
                MindEase may make mistakes, user discretion is strongly advised.
              </p>

              <div className="flex justify-center gap-4 pt-4">
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
                <Button onClick={onSaveResult} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      {isAuthenticated ? (
                        <Save className="mr-2 h-4 w-4" />
                      ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                      )}
                      {isAuthenticated ? 'Save Result' : 'Log in'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
