"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, CircleDollarSign, Gift, Heart, HelpCircle, Package, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

type ActivityType =
  | "campaign_created"
  | "donation_made"
  | "help_request_submitted"
  | "donation_item_listed"
  | "community_drive_created"
  | "profile_updated"

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  created_at: string
  link?: string
  metadata?: Record<string, any>
}

export function DashboardActivityFeed() {
  const { supabase, user } = useSupabase()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        // Since we don't have a dedicated activity table yet, we'll simulate activities
        // by fetching recent data from various tables
        const mockActivities: Activity[] = []

        // Fetch recent campaigns
        const { data: campaigns, error: campaignsError } = await supabase
          .from("campaigns")
          .select("id, title, created_at")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (campaignsError) throw campaignsError

        campaigns?.forEach((campaign) => {
          mockActivities.push({
            id: `campaign-${campaign.id}`,
            type: "campaign_created",
            title: "Campaign Created",
            description: campaign.title,
            created_at: campaign.created_at,
            link: `/campaigns/${campaign.id}`,
          })
        })

        // Fetch recent donations
        const { data: donations, error: donationsError } = await supabase
          .from("donations")
          .select("id, amount, created_at, campaign:campaigns(id, title)")
          .eq("donor_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (donationsError) throw donationsError

        donations?.forEach((donation) => {
          mockActivities.push({
            id: `donation-${donation.id}`,
            type: "donation_made",
            title: "Donation Made",
            description: `$${donation.amount?.toFixed(2)} to ${donation.campaign?.title || "a campaign"}`,
            created_at: donation.created_at,
            link: `/campaigns/${donation.campaign?.id}`,
            metadata: {
              amount: donation.amount,
            },
          })
        })

        // Try to fetch help requests if table exists
        try {
          const { data: helpRequests } = await supabase
            .from("help_requests")
            .select("id, title, created_at")
            .eq("requester_id", user.id)
            .order("created_at", { ascending: false })
            .limit(3)

          helpRequests?.forEach((request) => {
            mockActivities.push({
              id: `help-request-${request.id}`,
              type: "help_request_submitted",
              title: "Help Request Submitted",
              description: request.title,
              created_at: request.created_at,
              link: `/help-requests/${request.id}`,
            })
          })
        } catch (error) {
          // Table might not exist yet
          console.log("Help requests table might not exist yet")
        }

        // Try to fetch donation items if table exists
        try {
          const { data: donationItems } = await supabase
            .from("donation_items")
            .select("id, title, created_at")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false })
            .limit(3)

          donationItems?.forEach((item) => {
            mockActivities.push({
              id: `donation-item-${item.id}`,
              type: "donation_item_listed",
              title: "Donation Item Listed",
              description: item.title,
              created_at: item.created_at,
              link: `/donation-items/${item.id}`,
            })
          })
        } catch (error) {
          // Table might not exist yet
          console.log("Donation items table might not exist yet")
        }

        // Sort activities by date
        mockActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setActivities(mockActivities)
      } catch (err: any) {
        console.error("Error fetching activity:", err)
        setError(err.message || "Failed to load activity feed")
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [supabase, user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-muted rounded animate-pulse"></div>
                </div>
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
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-xl font-medium mb-2">Error Loading Activity</h3>
          <p className="text-muted-foreground text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <User className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Activity Yet</h3>
          <p className="text-muted-foreground text-center">
            Your recent activities will appear here as you use HelpConnect.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <ActivityIcon type={activity.type} />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{activity.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.link ? (
                    <Link href={activity.link} className="hover:underline">
                      {activity.description}
                    </Link>
                  ) : (
                    activity.description
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityIcon({ type }: { type: ActivityType }) {
  switch (type) {
    case "campaign_created":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
          <Heart className="h-5 w-5 text-rose-500" />
        </div>
      )
    case "donation_made":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <CircleDollarSign className="h-5 w-5 text-blue-500" />
        </div>
      )
    case "help_request_submitted":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
          <HelpCircle className="h-5 w-5 text-purple-500" />
        </div>
      )
    case "donation_item_listed":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
          <Gift className="h-5 w-5 text-emerald-500" />
        </div>
      )
    case "community_drive_created":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
          <Calendar className="h-5 w-5 text-amber-500" />
        </div>
      )
    case "profile_updated":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <User className="h-5 w-5 text-gray-500" />
        </div>
      )
    default:
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Package className="h-5 w-5 text-gray-500" />
        </div>
      )
  }
}
