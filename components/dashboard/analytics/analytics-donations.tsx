"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import { AlertCircle } from "lucide-react"
import type { Campaign, Donation, User } from "@/lib/types"

export function AnalyticsDonations() {
  const { supabase, user } = useSupabase()
  const [recentDonations, setRecentDonations] = useState<(Donation & { donor: User | null; campaign: Campaign })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentDonations = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        // Get recent donations for user's campaigns
        const { data, error: donationsError } = await supabase
          .from("donations")
          .select(
            `
            *,
            donor:users(id, display_name, profile_image_url),
            campaign:campaigns(id, title)
          `,
          )
          .in("campaign_id", supabase.from("campaigns").select("id").eq("creator_id", user.id))
          .eq("payment_status", "completed")
          .order("created_at", { ascending: false })
          .limit(5)

        if (donationsError) throw donationsError

        setRecentDonations(data as (Donation & { donor: User | null; campaign: Campaign })[])
      } catch (err: any) {
        setError(err.message || "Failed to load recent donations")
      } finally {
        setLoading(false)
      }
    }

    fetchRecentDonations()
  }, [supabase, user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>The most recent donations to your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded"></div>
                </div>
                <div className="h-6 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>The most recent donations to your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 text-sm border rounded-md bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Donations</CardTitle>
        <CardDescription>The most recent donations to your campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        {recentDonations.length > 0 ? (
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    {donation.is_anonymous ? (
                      "A"
                    ) : donation.donor?.profile_image_url ? (
                      <img
                        src={donation.donor.profile_image_url || "/placeholder.svg"}
                        alt={donation.donor.display_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      donation.donor?.display_name?.charAt(0) || "U"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {donation.is_anonymous ? "Anonymous" : donation.donor?.display_name || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(donation.created_at).toLocaleDateString()} • {donation.campaign.title}
                    </p>
                  </div>
                </div>
                <p className="font-medium">${donation.amount?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No donations received yet</p>
          </div>
        )}
      </CardContent>
      {recentDonations.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/donations">View All Donations</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
