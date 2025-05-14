import { Suspense } from "react"
import type { Metadata } from "next"
import { DonationsHeader } from "@/components/dashboard/donations/donations-header"
import { DonationsList } from "@/components/dashboard/donations/donations-list"
import { DonationsLoading } from "@/components/dashboard/donations/donations-loading"

export const metadata: Metadata = {
  title: "Donation History | HelpConnect",
  description: "View your donation history and receipts.",
}

export default function DonationsPage() {
  return (
    <div className="container py-8">
      <DonationsHeader />
      <Suspense fallback={<DonationsLoading />}>
        <DonationsList />
      </Suspense>
    </div>
  )
}
