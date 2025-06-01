import { Mail, MapPin, Instagram, Phone } from 'lucide-react';
import { ContactCard, ContactCardProps } from '@/components/card';
import { JSX } from 'react';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Support',
};

export default function SupportPage() {
  const t = useTranslations('SupportPage');
  const contactInfo: Array<Omit<ContactCardProps, 'icon'> & { icon: JSX.Element }> = [
    {
      icon: <Mail className="size-6" />,
      title: t('emailTitle'),
      contactInfo: {
        type: 'email' as const,
        value: 'info@telkomuniversity.ac.id',
      },
      description: t('emailDesc'),
    },
    {
      icon: <MapPin className="size-6" />,
      title: t('officeTitle'),
      contactInfo: {
        type: 'website' as const,
        value: 'https://studentaffairs.telkomuniversity.ac.id/',
      },
      description: t('officeDesc'),
    },
    {
      icon: <Instagram className="size-6" />,
      title: t('instagramTitle'),
      contactInfo: {
        type: 'website' as const,
        value: 'https://bit.ly/KemahasiswaanTUP',
      },
      description: t('instagramDesc'),
    },
    {
      icon: <Phone className="size-6" />,
      title: t('whatsappTitle'),
      contactInfo: {
        type: 'website' as const,
        value: 'https://bit.ly/6281228307444',
      },
      description: t('whatsappDesc'),
    },
  ];

  return (
    <main className="py-16 md:py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr,2fr] lg:gap-16">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">
              {t('sectionLabel')}
            </p>
            <h1 className="text-3xl font-medium tracking-tight md:text-5xl">{t('sectionTitle')}</h1>
            <p className="text-lg text-muted-foreground">{t('sectionDesc')}</p>
          </div>

          {/* Right Column - Contact Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
            {contactInfo.map((info, index) => (
              <ContactCard
                key={index}
                icon={info.icon}
                title={info.title}
                contactInfo={info.contactInfo}
                description={info.description}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
