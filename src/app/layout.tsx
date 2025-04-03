import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { checkAndUpdateUserStatuses } from '@/utils/check-account-status';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | MindEase',
    default: 'MindEase',
  },
  description:
    'A simple way for students to measure, track, and understand their stress levels throughout the academic year. Save your scan results and monitor your progress over time.',
  metadataBase: new URL('https://mindease.vercel.app'),
  openGraph: {
    images: '/og-image.png',
  },
};

// Run check when app loads on client
if (typeof window !== 'undefined') {
  // Run immediately and then daily
  checkAndUpdateUserStatuses();

  // Set up daily check
  setInterval(checkAndUpdateUserStatuses, 24 * 60 * 60 * 1000);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
