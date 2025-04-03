import { Mail, MapPin, Instagram, Phone } from 'lucide-react';
import { ContactCard, ContactCardProps } from '@/components/card';
import { JSX } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
};

export default function SupportPage() {
  const contactInfo: Array<Omit<ContactCardProps, 'icon'> & { icon: JSX.Element }> = [
    {
      icon: <Mail className="size-6" />,
      title: 'Email',
      contactInfo: {
        type: 'email' as const,
        value: 'info@telkomuniversity.ac.id',
      },
      description: 'They usually respond within 1-2 business days',
    },
    {
      icon: <MapPin className="size-6" />,
      title: 'Office',
      contactInfo: {
        type: 'website' as const,
        value: 'https://studentaffairs.telkomuniversity.ac.id/',
      },
      description: 'DI Panjaitan No.128, Purwokerto Selatan 53147',
    },
    {
      icon: <Instagram className="size-6" />,
      title: 'Instagram',
      contactInfo: {
        type: 'website' as const,
        value: 'https://bit.ly/KemahasiswaanTUP',
      },
      description: 'Available during business hours',
    },
    {
      icon: <Phone className="size-6" />,
      title: 'WhatsApp',
      contactInfo: {
        type: 'website' as const,
        value: 'https://bit.ly/6281228307444',
      },
      description: 'Monday-Friday at 09:00-17:00 WIB',
    },
  ];

  return (
    <main className="py-16 md:py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr,2fr] lg:gap-16">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">Support</p>
            <h1 className="text-3xl font-medium tracking-tight md:text-5xl">Get in touch</h1>
            <p className="text-lg text-muted-foreground">
              Need some academic assistant? The student affairs team is here to assist you with any
              questions or concerns you may have.
            </p>
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
