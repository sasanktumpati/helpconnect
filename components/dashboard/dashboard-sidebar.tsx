"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  CircleDollarSign,
  Gift,
  Heart,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react"
import { useSupabase } from "@/lib/supabase/provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
  children?: Omit<NavItem, "icon" | "children">[]
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useSupabase()
  const userRole = user?.user_metadata?.role || "individual"

  const navItems: NavItem[] = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["ngo", "organization"],
    },
    {
      title: "Campaigns",
      href: "/dashboard/campaigns",
      icon: Heart,
    },
    {
      title: "Help Requests",
      href: "/dashboard/help-requests",
      icon: HelpCircle,
    },
    {
      title: "Donation Items",
      href: "/dashboard/donation-items",
      icon: Gift,
    },
    {
      title: "Inventory",
      href: "/dashboard/inventory",
      icon: Package,
    },
    {
      title: "Community Drives",
      href: "/dashboard/community-drives",
      icon: Calendar,
    },
    {
      title: "Donations",
      href: "/dashboard/donations",
      icon: CircleDollarSign,
    },
  ]

  const exploreItems: NavItem[] = [
    {
      title: "Directory",
      href: "/directory",
      icon: Users,
    },
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
  ]

  const settingsItems: NavItem[] = [
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: Settings,
    },
  ]

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(href) && href !== "/dashboard"
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        <div className="flex items-center px-2 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary">HelpConnect</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {exploreItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
