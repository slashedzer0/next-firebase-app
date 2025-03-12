"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, LogOut, LayoutGrid, CircleGauge, FileChartColumn, Settings, ScanText } from 'lucide-react'
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Branding } from "@/components/branding"
import { useRoute } from "@/stores/use-route"
import { useAuth } from "@/stores/use-auth"
import { useRouter } from "next/navigation"

export function SideNav() {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const pathname = usePathname()
  const { activeRoute, setActiveRoute } = useRoute()

  useEffect(() => {
    setActiveRoute(pathname)
  }, [pathname, setActiveRoute])

  const linkClass = (href: string) =>
    `flex items-center gap-3 rounded-lg ${
      activeRoute === href
        ? "bg-muted px-3 py-2 text-primary"
        : "px-3 py-2 text-muted-foreground"
    } transition-all hover:text-primary`

  return (
    <div className="hidden sticky top-0 h-screen border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Branding />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/dashboard/uid"
              className={linkClass("/dashboard/uid")}
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/scan"
              className={linkClass("/scan")}
              target="_blank"
            >
              <CircleGauge className="h-4 w-4" />
              Start Scan
            </Link>
            <Link
              href="/dashboard/uid/results"
              className={linkClass("/dashboard/uid/results")}
            >
              <FileChartColumn className="h-4 w-4" />
              Scan Results
            </Link>
            <Link
              href="/dashboard/admin/reports"
              className={linkClass("/dashboard/admin/reports")}
            >
              <ScanText className="h-4 w-4" />
              Scan Reports
            </Link>
            <Link
              href="/dashboard/admin/users"
              className={linkClass("/dashboard/admin/users")}
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/dashboard/uid/settings"
              className={linkClass("/dashboard/uid/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut size="icon" className="h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
