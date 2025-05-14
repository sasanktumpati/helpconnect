import { Suspense } from "react"
import { DashboardCampaigns } from "@/components/dashboard/campaigns/dashboard-campaigns"
import { DashboardCampaignsLoading } from "@/components/dashboard/campaigns/dashboard-campaigns-loading"

export const metadata = {
  title: "My Campaigns | HelpConnect",
  description: "Manage your campaigns on HelpConnect",
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardCampaignsLoading />}>
        <DashboardCampaigns />
      </Suspense>
    </div>
  )
}
