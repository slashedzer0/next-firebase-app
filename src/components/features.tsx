import { ScanLine, Zap, LineChart, ShieldBan } from 'lucide-react';
import { InfoCard } from '@/components/card';
import { useTranslations } from 'next-intl';

export function FeaturesSection() {
  const t = useTranslations('FeaturesSection');
  const features = [
    {
      icon: <ScanLine className="size-6" />,
      title: t('easyScanningTitle'),
      description: t('easyScanningDesc'),
    },
    {
      icon: <Zap className="size-6" />,
      title: t('instantResultsTitle'),
      description: t('instantResultsDesc'),
    },
    {
      icon: <LineChart className="size-6" />,
      title: t('progressTrackingTitle'),
      description: t('progressTrackingDesc'),
    },
    {
      icon: <ShieldBan className="size-6" />,
      title: t('zeroSetupTitle'),
      description: t('zeroSetupDesc'),
    },
  ];

  return (
    <section id="features" className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">
              {t('sectionLabel')}
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">{t('sectionTitle')}</h2>
            <p className="text-lg text-muted-foreground md:max-w-2xl">{t('sectionDescription')}</p>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <InfoCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
