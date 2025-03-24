"use client";

import { UnauthenticatedRoute } from "@/components/auth/route-protection";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UnauthenticatedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </div>
    </UnauthenticatedRoute>
  );
}
