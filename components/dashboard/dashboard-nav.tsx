"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, CircleDollarSign, Heart, LayoutDashboard, Settings, Users } from "lucide-react"
import { useSupabase } from "@/lib/supabase/provider"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useSupabase()
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
      title: "Community Drives",
      href: "/dashboard/community-drives",
      icon: Calendar,
    },
    {
      title: "Donations",
      href: "/dashboard/donations",
      icon: CircleDollarSign,
    },
    {
      title: "Directory",
      href: "/directory",
      icon: Users,
    },
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

  return (
    <nav className="grid gap-1">
      {filteredNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
