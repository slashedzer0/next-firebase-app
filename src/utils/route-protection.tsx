"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/stores/use-auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// For routes that require authentication (dashboard routes)
export function AuthenticatedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect during initial loading
    if (loading.initial) return;

    // If not authenticated, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // If user has no role, redirect to homepage
    if (!user.role) {
      router.replace("/");
      return;
    }

    // Handle role-specific path restrictions
    if (user.role === "student") {
      // Check if student is trying to access admin routes
      if (pathname.startsWith("/dashboard/admin")) {
        router.replace(`/dashboard/${user.username}`);
        return;
      }

      // Check if student is trying to access another student's routes
      const pathSegments = pathname.split("/");
      if (
        pathSegments[2] &&
        pathSegments[1] === "dashboard" &&
        pathSegments[2] !== user.username
      ) {
        router.replace(`/dashboard/${user.username}`);
        return;
      }
    } else if (user.role === "admin") {
      // Check if admin is trying to access student-specific routes
      const pathSegments = pathname.split("/");
      if (
        pathSegments[2] &&
        pathSegments[1] === "dashboard" &&
        pathSegments[2] !== "admin" &&
        !pathSegments[2].includes(user.username || "")
      ) {
        router.replace("/dashboard/admin");
        return;
      }
    }
  }, [user, loading.initial, pathname, router]);

  // Show nothing while checking authentication or redirecting
  if (loading.initial || !user || !user.role) return null;

  return <>{children}</>;
}

// For routes that should be accessed only by unauthenticated users (login, signup)
export function UnauthenticatedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect during initial loading
    if (loading.initial) return;

    // If authenticated, redirect based on role
    if (user) {
      if (user.role === "student") {
        router.replace(`/dashboard/${user.username}`);
      } else if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else {
        // If no role, redirect to homepage
        router.replace("/");
      }
    }
  }, [user, loading.initial, router]);

  // Show nothing while checking authentication or redirecting
  if (loading.initial || user) return null;

  return <>{children}</>;
}
