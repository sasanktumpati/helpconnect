import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CampaignDetailView } from "@/components/campaigns/campaign-detail-view"
import { CampaignDetailSkeleton } from "@/components/campaigns/campaign-detail-skeleton"
import { createClient } from "@/lib/supabase/server"

interface CampaignPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
  if (params.id === "new") {
    return {
      title: "Create Campaign | HelpConnect",
      description: "Create a new campaign to raise support for your cause.",
    }
  }

  const supabase = createClient()

  try {
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .select("title, description, images")
      .eq("id", params.id)
      .single()

    if (error || !campaign) {
      return {
        title: "Campaign Not Found | HelpConnect",
        description: "The requested campaign could not be found.",
      }
    }

    return {
      title: `${campaign.title} | HelpConnect`,
      description: campaign.description?.substring(0, 160) || "View campaign details and support the cause.",
      openGraph: {
        title: campaign.title,
        description: campaign.description?.substring(0, 160) || "View campaign details and support the cause.",
        images: campaign.images?.[0] ? [{ url: campaign.images[0] }] : undefined,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: campaign.title,
        description: campaign.description?.substring(0, 160) || "View campaign details and support the cause.",
        images: campaign.images?.[0] ? [campaign.images[0]] : undefined,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Campaign | HelpConnect",
      description: "View campaign details and support the cause.",
    }
  }
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  if (params.id === "new") {
    notFound()
    return null
  }

  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("campaigns").select("id").eq("id", params.id).single()

    if (error || !data) {
      notFound()
    }
  } catch (error) {
    console.error("Error checking campaign existence:", error)
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container py-8 px-4 md:px-6">
        <Suspense fallback={<CampaignDetailSkeleton />}>
          <CampaignDetailView id={params.id} />
        </Suspense>
      </div>
    </main>
  )
}
