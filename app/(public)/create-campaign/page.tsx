import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CampaignForm } from "@/components/campaigns/campaign-form"
import { Suspense } from "react"
import { CampaignFormSkeleton } from "@/components/campaigns/campaign-form-skeleton"

export const metadata: Metadata = {
  title: "Create Campaign | HelpConnect",
  description: "Create a new campaign to raise support for your cause.",
}

export default async function CreateCampaignPage() {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error checking session:", error)
      redirect("/auth/login?redirect=/create-campaign")
    }

    if (!session) {
      console.log("No session found, redirecting to login")
      redirect("/auth/login?redirect=/create-campaign")
    }

    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create a Campaign</h1>
          <p className="text-muted-foreground mb-8">
            Fill out the form below to create a new campaign and start raising support.
          </p>

          <Suspense fallback={<CampaignFormSkeleton />}>
            <CampaignForm userId={session.user.id} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Unexpected error in create campaign page:", error)
    redirect("/auth/login?redirect=/create-campaign")
  }
}
