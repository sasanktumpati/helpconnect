import { Suspense } from "react"
import type { Metadata } from "next"
import { CampaignsList } from "@/components/campaigns/campaigns-list"
import { CampaignsHeader } from "@/components/campaigns/campaigns-header"
import { CampaignsFilters } from "@/components/campaigns/campaigns-filters"
import { CampaignsLoading } from "@/components/campaigns/campaigns-loading"

export const metadata: Metadata = {
  title: "Campaigns | HelpConnect",
  description: "Browse and support campaigns for community aid and disaster relief.",
}

export default function CampaignsPage() {
  return (
    <div className="container py-8">
      <CampaignsHeader />
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="md:w-1/4">
          <Suspense fallback={<div className="p-6 border rounded-lg bg-background animate-pulse h-96"></div>}>
            <CampaignsFilters />
          </Suspense>
        </div>
        <div className="md:w-3/4">
          <Suspense fallback={<CampaignsLoading />}>
            <CampaignsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
