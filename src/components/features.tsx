import { ScanLine, Zap, LineChart, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
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
  )
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <ScanLine className="size-6" />,
      title: "Easy Scanning",
      description:
        "Quick and simple stress measurement scans that you can complete in minutes. Perfect for busy students on the go.",
    },
    {
      icon: <Zap className="size-6" />,
      title: "Instant Results",
      description:
        "Get immediate feedback on your stress levels after each scan. Understand where you stand at any moment.",
    },
    {
      icon: <LineChart className="size-6" />,
      title: "Progress Tracking",
      description:
        "Save all your scan results and track changes over time. Identify patterns and trends in your stress levels.",
    },
    {
      icon: <ShieldCheck className="size-6" />,
      title: "No Login Required",
      description:
        "Start measuring your stress levels immediately without creating an account. Quick and hassle-free access to core features.",
    },
  ]

  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">Key Features</p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
              Simple tools to manage your academic stress
            </h2>
            <p className="text-lg text-muted-foreground md:max-w-2xl">
              Our app focuses on what matters most to students - 
              easy tracking and monitoring of stress levels during your academic journey. 
              No complicated features, just the essentials you need.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}