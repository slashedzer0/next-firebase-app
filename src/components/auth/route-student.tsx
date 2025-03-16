"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/stores/use-auth";

type UserRouteProps = {
  children: React.ReactNode;
};

export function UserRoute({ children }: UserRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Don't redirect during initial loading
    if (loading.initial) return;

    // If not authenticated, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Get the uid from the route parameters
    const uid = params?.uid as string;

    // Admin can access any user route
    if (user.role === "admin") {
      return;
    }

    // Students can only access their own routes
    if (user.role === "student" && uid && uid !== user.username) {
      router.replace(`/dashboard/${user.username}`);
      return;
    }
  }, [user, loading.initial, router, params]);

  // Show nothing while checking authentication or redirecting
  if (loading.initial || !user) return null;

  return <>{children}</>;
}
