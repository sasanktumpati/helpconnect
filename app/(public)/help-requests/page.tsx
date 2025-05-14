import { Suspense } from "react"
import type { Metadata } from "next"
import { HelpRequestsList } from "@/components/help-requests/help-requests-list"
import { HelpRequestsHeader } from "@/components/help-requests/help-requests-header"
import { HelpRequestsFilters } from "@/components/help-requests/help-requests-filters"
import { HelpRequestsLoading } from "@/components/help-requests/help-requests-loading"

export const metadata: Metadata = {
  title: "Help Requests | HelpConnect",
  description: "Browse and respond to help requests from individuals and communities.",
}

export default function HelpRequestsPage() {
  return (
    <div className="container py-8">
      <HelpRequestsHeader />
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="md:w-1/4">
          <Suspense fallback={<div className="p-6 border rounded-lg bg-background animate-pulse h-96"></div>}>
            <HelpRequestsFilters />
          </Suspense>
        </div>
        <div className="md:w-3/4">
          <Suspense fallback={<HelpRequestsLoading />}>
            <HelpRequestsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
