import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function CampaignNewPage() {
  const supabase = createClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      redirect("/create-campaign")
    } else {
      redirect("/auth/login?redirect=/create-campaign")
    }
  } catch (error) {
    console.error("Error in campaigns/new redirect:", error)
    redirect("/auth/login?redirect=/create-campaign")
  }
}
