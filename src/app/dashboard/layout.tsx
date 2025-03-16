"use client";

import { SideNav } from "./_components/nav-side";
import { TopNav } from "./_components/nav-top";
import { AuthenticatedRoute } from "@/utils/route-protection";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedRoute>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <SideNav />
        <div className="flex flex-col">
          <TopNav />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted">
            {children}
          </main>
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
