import type React from "react"
import type { Metadata } from "next"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Dashboard | HelpConnect",
  description: "Manage your campaigns, donations, and help requests.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
