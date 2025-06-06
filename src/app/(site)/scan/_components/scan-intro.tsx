import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/stores/use-auth-store';
import { incrementAssessmentCount, updateUserActivity } from '@/utils';
import { ScanIntroProps } from '@/types/assessment';
import { useTranslations } from 'next-intl';

export function ScanIntro({ onStart }: ScanIntroProps) {
  const user = useAuth((state) => state.user);
  const t = useTranslations('ScanPage');

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
              {t('introLabel')}
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">{t('introTitle')}</h2>
            <div className="space-y-6 text-lg text-muted-foreground md:max-w-2xl">
              <p>{t('introDesc1')}</p>
              <p>{t('introDesc2')}</p>
              <p className="text-sm italic text-muted-foreground/80">{t('introDesc3')}</p>
            </div>

            <Button onClick={handleStart} className="mt-4 w-full sm:w-auto">
              {t('introButton')}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
