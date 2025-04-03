'use client';

import { AdminRoute } from '@/middleware/route-admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRoute>{children}</AdminRoute>;
}
