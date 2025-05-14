import { Suspense } from "react"
import type { Metadata } from "next"
import { CommunityDrivesList } from "@/components/community-drives/community-drives-list"
import { CommunityDrivesHeader } from "@/components/community-drives/community-drives-header"
import { CommunityDrivesFilters } from "@/components/community-drives/community-drives-filters"
import { CommunityDrivesLoading } from "@/components/community-drives/community-drives-loading"

export const metadata: Metadata = {
  title: "Community Drives | HelpConnect",
  description: "Browse and join community drives and volunteer opportunities.",
}

export default function CommunityDrivesPage() {
  return (
    <div className="container py-8">
      <CommunityDrivesHeader />
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="md:w-1/4">
          <Suspense fallback={<div className="p-6 border rounded-lg bg-background animate-pulse h-96"></div>}>
            <CommunityDrivesFilters />
          </Suspense>
        </div>
        <div className="md:w-3/4">
          <Suspense fallback={<CommunityDrivesLoading />}>
            <CommunityDrivesList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
