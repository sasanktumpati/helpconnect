import { Suspense } from "react"
import { DashboardCommunityDrives } from "@/components/dashboard/community-drives/dashboard-community-drives"
import { DashboardCommunityDrivesLoading } from "@/components/dashboard/community-drives/dashboard-community-drives-loading"

export const metadata = {
  title: "My Community Drives | HelpConnect",
  description: "Manage your community drives on HelpConnect",
}

export default function CommunityDrivesPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardCommunityDrivesLoading />}>
        <DashboardCommunityDrives />
      </Suspense>
    </div>
  )
}
