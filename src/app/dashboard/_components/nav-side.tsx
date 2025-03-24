"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  LogOut,
  LayoutGrid,
  CircleGauge,
  FileChartColumn,
  Settings,
  ScanText,
} from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Branding } from "@/components/branding";
import { useRoute } from "@/stores/use-route";
import { useAuth } from "@/stores/use-auth";
import { useRouter } from "next/navigation";

export function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeRoute, setActiveRoute } = useRoute();
  const { user, signOut } = useAuth();

  // Get username and role from auth store
  const username = user?.username || "uid";
  const userRole = user?.role || "student";

  // Use "admin" as path for admin users, username for students
  const userPath = userRole === "admin" ? "admin" : username;

  // Define navigation items based on user role
  const navItems = [
    {
      href: `/dashboard/${userPath}`,
      label: "Dashboard",
      icon: <LayoutGrid className="h-4 w-4" />,
      roles: ["student", "admin"],
    },
    {
      href: "/scan",
      label: "Start Scan",
      icon: <CircleGauge className="h-4 w-4" />,
      roles: ["student"], // Removed admin access
      target: "_blank",
    },
    {
      href: `/dashboard/${userPath}/results`,
      label: "Scan Results",
      icon: <FileChartColumn className="h-4 w-4" />,
      roles: ["student"], // Removed admin access
    },
    {
      href: "/dashboard/admin/reports",
      label: "Scan Reports",
      icon: <ScanText className="h-4 w-4" />,
      roles: ["admin"],
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: <Users className="h-4 w-4" />,
      roles: ["admin"],
    },
    {
      href: `/dashboard/${userPath}/settings`,
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      roles: ["student"], // Removed admin access
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname, setActiveRoute]);

  const linkClass = (href: string) =>
    `flex items-center gap-3 rounded-lg ${
      activeRoute === href
        ? "bg-muted px-3 py-2 text-primary"
        : "px-3 py-2 text-muted-foreground"
    } transition-all hover:text-primary`;

  return (
    <div className="hidden sticky top-0 h-screen border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Branding />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems
              .filter((item) => item.roles.includes(userRole))
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={linkClass(item.href)}
                  target={item.target}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleSignOut}
            title="Sign out (your last activity will be recorded)"
          >
            <LogOut size="icon" className="h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
