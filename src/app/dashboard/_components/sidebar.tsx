"use client";

import * as React from "react"
import Link from "next/link"
import { 
  House, 
  CircleGauge, 
  FileChartColumn, 
  Settings, 
  Origami, 
  ScanText, 
} from 'lucide-react'

import { SidebarNav } from "./sidebar-nav"
import { SidebarAccount } from "./sidebar-account"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "cn@goated.me",
    avatar: "/avatars/shadcn.jpg",
  },
  userMenuItems: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
      isActive: true,
    },
    {
      title: "Start Scan",
      url: "#",
      icon: CircleGauge,
    },
    {
      title: "Scan Results",
      url: "#",
      icon: FileChartColumn,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],

  adminMenuItems: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
      isActive: true,
    },
    {
      title: "Scan Reports",
      url: "#",
      icon: ScanText,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="MindEase">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Origami className="size-4" />
                </div>
                <p className="text-xl font-extrabold tracking-tight">
                  MindEase
                </p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav items={data.userMenuItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccount user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

