import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'About Us',
};

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">
              {t('sectionLabel')}
            </p>
            <h2
              className="text-3xl font-medium tracking-tight md:text-5xl"
              dangerouslySetInnerHTML={{ __html: t('sectionTitle') }}
            />
            <div className="space-y-6 text-lg text-muted-foreground md:max-w-2xl">
              <p>{t('desc1')}</p>
              <p>{t('desc2')}</p>
              <p className="text-sm italic">{t('disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
