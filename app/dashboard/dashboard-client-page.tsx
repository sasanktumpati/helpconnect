"use client"

import { Suspense } from "react"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { DashboardLoading } from "@/components/dashboard/dashboard-loading"

export default function DashboardClientPage() {
  return (
    <div className="space-y-8 animate-in">
      <DashboardWelcome />
      <Suspense fallback={<DashboardLoading />}>
        <DashboardOverview />
      </Suspense>
    </div>
  )
}
