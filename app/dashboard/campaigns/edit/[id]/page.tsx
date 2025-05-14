import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CampaignEditForm } from "@/components/campaigns/campaign-edit-form"
import { getCampaignById } from "@/lib/supabase/database"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Edit Campaign | HelpConnect",
  description: "Edit your fundraising campaign on HelpConnect",
}

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/campaigns")
  }

  try {
    const campaign = await getCampaignById(params.id)

    if (!campaign) {
      redirect("/dashboard/campaigns")
    }

    if (campaign.creator_id !== session.user.id) {
      redirect("/dashboard/campaigns")
    }

    return (
      <div className="container max-w-4xl py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Campaign</h1>
        <CampaignEditForm userId={session.user.id} campaignId={params.id} campaign={campaign} />
      </div>
    )
  } catch (error) {
    console.error("Error loading campaign:", error)
    return (
      <div className="container py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading campaign data...</p>
      </div>
    )
  }
}
