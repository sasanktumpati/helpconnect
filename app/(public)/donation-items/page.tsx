import { Suspense } from "react"
import { DonationItemsHeader } from "@/components/donation-items/donation-items-header"
import { DonationItemsFilters } from "@/components/donation-items/donation-items-filters"
import { DonationItemsList } from "@/components/donation-items/donation-items-list"
import { DonationItemsLoading } from "@/components/donation-items/donation-items-loading"

export const metadata = {
  title: "Items for Donation | HelpConnect",
  description: "Browse items available for donation from individuals and organizations.",
}

export default function DonationItemsPage() {
  return (
    <div className="container py-6 space-y-6">
      <DonationItemsHeader />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Suspense fallback={<div className="h-[200px] rounded-lg bg-muted animate-pulse" />}>
          <div className="md:col-span-1">
            <DonationItemsFilters />
          </div>
        </Suspense>
        <div className="md:col-span-3">
          <Suspense fallback={<DonationItemsLoading />}>
            <DonationItemsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
