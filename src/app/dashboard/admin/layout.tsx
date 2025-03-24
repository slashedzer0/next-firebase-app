"use client";

import { AdminRoute } from "@/components/auth/route-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoute>{children}</AdminRoute>;
}
