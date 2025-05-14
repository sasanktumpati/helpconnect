import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getDonationItemById } from "@/lib/supabase/database"
import { DonationItemDetail } from "@/components/donation-items/donation-item-detail"
import { DonationItemDetailSkeleton } from "@/components/donation-items/donation-item-detail-skeleton"

export const dynamic = "force-dynamic"

interface DonationItemPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DonationItemPageProps) {
  try {
    const item = await getDonationItemById(params.id)
    return {
      title: `${item.title} | HelpConnect`,
      description: item.description || `View details about ${item.title} available for donation.`,
    }
  } catch (error) {
    return {
      title: "Item Not Found | HelpConnect",
      description: "The requested donation item could not be found.",
    }
  }
}

export default async function DonationItemPage({ params }: DonationItemPageProps) {
  try {
    const item = await getDonationItemById(params.id)

    if (!item || !item.is_available) {
      notFound()
    }

    return (
      <div className="container py-6">
        <Suspense fallback={<DonationItemDetailSkeleton />}>
          <DonationItemDetail id={params.id} />
        </Suspense>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
