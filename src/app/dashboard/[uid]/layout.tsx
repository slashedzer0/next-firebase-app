"use client";

import { UserRoute } from "@/utils/route-student";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserRoute>{children}</UserRoute>;
}
