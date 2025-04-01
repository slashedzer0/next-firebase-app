import { Card, CardContent } from '@/components/ui/card';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ContactCardProps extends Omit<FeatureCardProps, 'description'> {
  contactInfo: {
    type: 'email' | 'phone' | 'website';
    value: string;
  };
  description: string;
}

export function InfoCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="flex flex-col justify-between md:min-h-[300px]">
      <CardContent className="p-6 md:p-8">
        <span className="mb-6 flex size-11 items-center justify-center rounded-full bg-primary/10">
          <div className="text-primary">{icon}</div>
        </span>
        <div>
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
          <p className="mt-2 text-base text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContactCard({ icon, title, contactInfo, description }: ContactCardProps) {
  const getContactLink = () => {
    switch (contactInfo.type) {
      case 'email':
        return `mailto:${contactInfo.value}`;
      case 'phone':
        return `tel:${contactInfo.value}`;
      case 'website':
        return contactInfo.value;
      default:
        return '#';
    }
  };

  const getDisplayValue = (value: string) => {
    if (contactInfo.type === 'website' && value.startsWith('https://')) {
      // Remove 'https://' and any trailing '/'
      return value.replace(/^https:\/\//i, '').replace(/\/$/, '');
    }
    return value;
  };

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-6 md:p-8">
        <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary/10">
          <div className="text-primary">{icon}</div>
        </span>
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
          <a
            href={getContactLink()}
            className="inline-block text-primary hover:underline break-all"
            target={contactInfo.type === 'website' ? '_blank' : undefined}
            rel={contactInfo.type === 'website' ? 'noopener noreferrer' : undefined}
          >
            {getDisplayValue(contactInfo.value)}
          </a>
          <p className="text-base text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
