import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/stores/use-auth';
import { incrementAssessmentCount, updateUserActivity } from '@/utils';

interface ScanIntroProps {
  onStart: () => void;
}

export function ScanIntro({ onStart }: ScanIntroProps) {
  const user = useAuth((state) => state.user);

  const handleStart = () => {
    // Increment counter and update lastActive if user is authenticated
    if (user?.uid) {
      incrementAssessmentCount(user.uid);
      updateUserActivity(user.uid);
    }

    // Call the original onStart function
    onStart();
  };

  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">
              Stress Assessment
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">How the scan works</h2>
            <div className="space-y-6 text-lg text-muted-foreground md:max-w-2xl">
              <p>
                The assessment uses a balanced measurement approach that helps identify different
                aspects of stress in your daily life. We consider both the frequency and intensity
                of your experiences to provide a more accurate picture.
              </p>
              <p>
                For each statement, you&apos;ll indicate how certain you are about experiencing
                specific stress indicators. This approach, based on certainty factors, allows us to
                measure stress levels more naturally than traditional yes-or-no answers.
              </p>
              <p className="text-sm italic text-muted-foreground/80">
                For best results, please answer each question thoughtfully and honestly.
              </p>
            </div>

            <Button onClick={handleStart} className="mt-4 w-full sm:w-auto">
              Scan Now
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
