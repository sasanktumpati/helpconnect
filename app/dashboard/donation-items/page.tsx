import { Suspense } from "react"
import { DashboardDonationItems } from "@/components/dashboard/donation-items/dashboard-donation-items"
import { DashboardDonationItemsLoading } from "@/components/dashboard/donation-items/dashboard-donation-items-loading"

export const metadata = {
  title: "My Donation Items | HelpConnect",
  description: "Manage your donation items on HelpConnect",
}

export default function DonationItemsPage() {
  return (
    <Suspense fallback={<DashboardDonationItemsLoading />}>
      <DashboardDonationItems />
    </Suspense>
  )
}
