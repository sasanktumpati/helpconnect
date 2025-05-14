import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DonationItemForm } from "@/components/donation-items/donation-item-form"
import { AuthPrompt } from "@/components/auth/auth-prompt"

export const metadata = {
  title: "Donate an Item | HelpConnect",
  description: "Donate items to those in need through our platform.",
}

export default async function NewDonationItemPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container py-6">
        <AuthPrompt
          title="Sign in to donate items"
          description="You need to be signed in to donate items. Please sign in or create an account to continue."
          returnTo="/donation-items/new"
        />
      </div>
    )
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  if (!profile || !profile.profile_completed) {
    redirect("/dashboard/profile/complete?returnTo=/donation-items/new")
  }

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Donate an Item</h1>
        <Suspense fallback={<div className="h-[600px] bg-muted rounded-lg animate-pulse" />}>
          <DonationItemForm userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  )
}
