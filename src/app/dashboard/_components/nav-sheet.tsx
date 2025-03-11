"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Users,
  LogOut,
  LayoutGrid,
  CircleGauge,
  FileChartColumn,
  ScanText,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Branding } from "@/components/branding";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRoute } from "@/stores/use-route";

export function SheetNav() {
  const pathname = usePathname();
  const { activeRoute, setActiveRoute } = useRoute();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname, setActiveRoute]);

  const linkClass = (href: string) => {
    if (href === "/scan") {
      return "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground";
    }

    return `mx-[-0.65rem] flex items-center gap-4 rounded-xl ${
      activeRoute === href
        ? "bg-muted px-3 py-2 text-primary"
        : "px-3 py-2 text-muted-foreground"
    }`;
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="grid gap-2 text-lg font-medium">
          <Branding />
          <Link
            href="/dashboard/uid"
            className={linkClass("/dashboard/uid")}
            onClick={handleLinkClick}
          >
            <LayoutGrid className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/scan"
            className={linkClass("/scan")}
            target="_blank"
            onClick={handleLinkClick}
          >
            <CircleGauge className="h-5 w-5" />
            Start Scan
          </Link>
          <Link
            href="/dashboard/uid/results"
            className={linkClass("/dashboard/uid/results")}
            onClick={handleLinkClick}
          >
            <FileChartColumn className="h-5 w-5" />
            Scan Results
          </Link>
          <Link
            href="/dashboard/admin/reports"
            className={linkClass("/dashboard/admin/reports")}
            onClick={handleLinkClick}
          >
            <ScanText className="h-5 w-5" />
            Scan Reports
          </Link>
          <Link
            href="/dashboard/admin/users"
            className={linkClass("/dashboard/admin/users")}
            onClick={handleLinkClick}
          >
            <Users className="h-5 w-5" />
            Users
          </Link>
          <Link
            href="/dashboard/uid/settings"
            className={linkClass("/dashboard/uid/settings")}
            onClick={handleLinkClick}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="mt-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center gap-2"
          >
            <LogOut size="icon" className="h-5 w-5" />
            Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
