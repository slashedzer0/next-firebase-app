import Link from "next/link"
import { Users, LogOut, LayoutGrid, CircleGauge, FileChartColumn, Settings, ScanText } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Branding } from "@/components/branding"

export function SideNav() {
  return (
    <div className="hidden sticky top-0 h-screen border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Branding />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <CircleGauge className="h-4 w-4" />
              Start Scan
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <FileChartColumn className="h-4 w-4" />
              Scan Results
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ScanText className="h-4 w-4" />
              Scan Reports
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <LogOut size="icon" className="h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}

