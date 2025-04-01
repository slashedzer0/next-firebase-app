'use client';

import { UserRoute } from '@/middleware/route-student';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <UserRoute>{children}</UserRoute>;
}
