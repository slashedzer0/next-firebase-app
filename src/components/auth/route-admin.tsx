"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/use-auth";

type AdminRouteProps = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect during initial loading
    if (loading.initial) return;

    // If not authenticated, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // If not admin, redirect to appropriate dashboard
    if (user.role !== "admin") {
      if (user.role === "student" && user.username) {
        router.replace(`/dashboard/${user.username}`);
      } else {
        router.replace("/");
      }
      return;
    }
  }, [user, loading.initial, router]);

  // Show nothing while checking authentication or redirecting
  if (loading.initial || !user || user.role !== "admin") return null;

  return <>{children}</>;
}
