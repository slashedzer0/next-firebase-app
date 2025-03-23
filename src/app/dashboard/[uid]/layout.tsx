"use client";

import { UserRoute } from "@/components/auth/route-student";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserRoute>{children}</UserRoute>;
}
