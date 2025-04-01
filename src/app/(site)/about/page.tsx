export default function AboutPage() {
  return (
    <section className="py-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">About Us</p>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
              Supporting student <br /> mental health
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground md:max-w-2xl">
              <p>
                Students commonly experience stress during their academic journey, especially during
                exam periods and assignment deadlines. Many students don&apos;t have a systematic
                way to track their stress levels over time.
              </p>
              <p>
                This project aims to provide students with a simple tool for tracking their stress
                levels. Through our easy-to-use platform, we may help identify stress patterns and
                empower students to better manage their mental well-being.
              </p>
              <p className="text-sm italic">
                MindEase by no means replaces professional mental health support. For serious
                concerns, please seek help from qualified mental health professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
