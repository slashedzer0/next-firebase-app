"use client";

import { AdminRoute } from "@/utils/route-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoute>{children}</AdminRoute>;
}
