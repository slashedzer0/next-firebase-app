import { ScanLine, Zap, LineChart, ShieldBan } from 'lucide-react';
import { InfoCard } from '@/components/card';

export function FeaturesSection() {
  const features = [
    {
      icon: <ScanLine className="size-6" />,
      title: 'Easy Scanning',
      description:
        'Quick and simple stress measurement scans that you can complete in minutes. Perfect for busy students on the go.',
    },
    {
      icon: <Zap className="size-6" />,
      title: 'Instant Results',
      description:
        'Get immediate feedback on your stress levels after each scan. Understand where you stand at any moment.',
    },
    {
      icon: <LineChart className="size-6" />,
      title: 'Progress Tracking',
      description:
        'Save all your scan results and track changes over time. Identify patterns and trends in your stress levels.',
    },
    {
      icon: <ShieldBan className="size-6" />,
      title: 'Zero Setup',
      description:
        'Start measuring your stress levels immediately without creating an account. Quick and hassle-free access to core features.',
    },
  ];

  return (
    <section id="features" className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">Key Features</p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
              Simple tools to manage your academic stress
            </h2>
            <p className="text-lg text-muted-foreground md:max-w-2xl">
              Our app focuses on what matters most to students - easy tracking and monitoring of
              stress levels during your academic journey. No complicated features, just the
              essentials you need.
            </p>
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
