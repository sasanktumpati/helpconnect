"use client"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import { useRouter } from "next/navigation"

export function CommunityDrivesHeader() {
  const { user } = useSupabase()
  const router = useRouter()

  const handleCreateCommunityDrive = () => {
    if (!user) {
      router.push("/auth/login?redirect=/community-drives/new")
    } else {
      router.push("/community-drives/new")
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Drives</h1>
        <p className="text-muted-foreground">Browse and join community drives and events.</p>
      </div>
      <Button onClick={handleCreateCommunityDrive}>Create Community Drive</Button>
    </div>
  )
}
