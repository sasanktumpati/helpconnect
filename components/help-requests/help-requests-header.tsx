"use client"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import { useRouter } from "next/navigation"

export function HelpRequestsHeader() {
  const { user } = useSupabase()
  const router = useRouter()

  const handleCreateHelpRequest = () => {
    if (!user) {
      router.push("/auth/login?redirect=/help-requests/new")
    } else {
      router.push("/help-requests/new")
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help Requests</h1>
        <p className="text-muted-foreground">Browse and respond to help requests from individuals and organizations.</p>
      </div>
      <Button onClick={handleCreateHelpRequest}>Create Help Request</Button>
    </div>
  )
}
