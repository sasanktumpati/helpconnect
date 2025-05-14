"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/provider"
import { getUserProfile } from "@/lib/supabase/database"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonationStats } from "@/components/dashboard/analytics/donation-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DonationTrends } from "@/components/dashboard/analytics/donation-trends"

export default function AnalyticsPage() {
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        const profile = await getUserProfile(user.id)
        setUserProfile(profile)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (userProfile && !userProfile.profile_completed) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">View detailed statistics and insights</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Incomplete</AlertTitle>
          <AlertDescription>Please complete your profile to access analytics.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">View detailed statistics and insights</p>
      </div>

      <Tabs defaultValue="donations">
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="donations" className="space-y-4">
          <DonationStats />
        </TabsContent>
        <TabsContent value="campaigns" className="space-y-4">
          <div className="rounded-md border p-8 text-center">
            <h2 className="text-lg font-medium">Campaign Analytics</h2>
            <p className="text-sm text-muted-foreground mt-2">Campaign analytics will be available soon.</p>
          </div>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <div className="rounded-md border p-8 text-center">
            <h2 className="text-lg font-medium">User Analytics</h2>
            <p className="text-sm text-muted-foreground mt-2">User analytics will be available soon.</p>
          </div>
        </TabsContent>
      </Tabs>
      <DonationTrends />
    </div>
  )
}
