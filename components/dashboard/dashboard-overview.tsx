"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/lib/supabase/provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, Calendar, CircleDollarSign, Gift, Heart, HelpCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { DashboardActivityFeed } from "@/components/dashboard/dashboard-activity-feed"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardLoading } from "@/components/dashboard/dashboard-loading"

export function DashboardOverview() {
  const { supabase, user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState({
    campaigns: [],
    helpRequests: [],
    donationItems: [],
    communityDrives: [],
    donations: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        // Fetch campaigns
        const { data: campaigns, error: campaignsError } = await supabase
          .from("campaigns")
          .select("*")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (campaignsError) throw campaignsError

        // Fetch help requests
        const { data: helpRequests, error: helpRequestsError } = await supabase
          .from("help_requests")
          .select("*")
          .eq("requester_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        // If table doesn't exist yet, ignore the error
        if (helpRequestsError && !helpRequestsError.message.includes("does not exist")) {
          throw helpRequestsError
        }

        // Fetch donation items
        const { data: donationItems, error: donationItemsError } = await supabase
          .from("donation_items")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (donationItemsError && !donationItemsError.message.includes("does not exist")) {
          throw donationItemsError
        }

        // Fetch community drives
        const { data: communityDrives, error: communityDrivesError } = await supabase
          .from("community_drives")
          .select("*")
          .eq("organizer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (communityDrivesError && !communityDrivesError.message.includes("does not exist")) {
          throw communityDrivesError
        }

        // Fetch donations
        const { data: donations, error: donationsError } = await supabase
          .from("donations")
          .select("*, campaign:campaigns(title)")
          .eq("donor_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (donationsError) throw donationsError

        setData({
          campaigns: campaigns || [],
          helpRequests: helpRequests || [],
          donationItems: donationItems || [],
          communityDrives: communityDrives || [],
          donations: donations || [],
        })
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase, user])

  if (loading) {
    return <DashboardLoading />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-xl font-medium mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground text-center mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardSection
          title="Your Campaigns"
          description="Fundraising campaigns you've created"
          icon={<Heart className="h-5 w-5" />}
          items={data.campaigns}
          emptyMessage="You haven't created any campaigns yet"
          renderItem={(campaign) => (
            <div key={campaign.id} className="flex items-start py-3 border-b last:border-0">
              <div className="flex-1">
                <h4 className="font-medium line-clamp-1">{campaign.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={campaign.is_active ? "default" : "outline"}>
                    {campaign.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="ml-2">
                <Link href={`/campaigns/${campaign.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
          viewAllLink="/dashboard/campaigns"
          createLink="/campaigns/new"
          createLabel="Create Campaign"
        />

        <DashboardSection
          title="Your Help Requests"
          description="Assistance requests you've submitted"
          icon={<HelpCircle className="h-5 w-5" />}
          items={data.helpRequests}
          emptyMessage="You haven't submitted any help requests yet"
          renderItem={(request) => (
            <div key={request.id} className="flex items-start py-3 border-b last:border-0">
              <div className="flex-1">
                <h4 className="font-medium line-clamp-1">{request.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      request.status === "open" ? "default" : request.status === "in_progress" ? "secondary" : "outline"
                    }
                  >
                    {request.status?.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="ml-2">
                <Link href={`/help-requests/${request.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
          viewAllLink="/dashboard/help-requests"
          createLink="/help-requests/new"
          createLabel="Submit Request"
        />

        <DashboardSection
          title="Your Donation Items"
          description="Items you've listed for donation"
          icon={<Gift className="h-5 w-5" />}
          items={data.donationItems}
          emptyMessage="You haven't listed any donation items yet"
          renderItem={(item) => (
            <div key={item.id} className="flex items-start py-3 border-b last:border-0">
              <div className="flex-1">
                <h4 className="font-medium line-clamp-1">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={item.is_available ? "default" : "outline"}>
                    {item.is_available ? "Available" : "Unavailable"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Listed {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="ml-2">
                <Link href={`/donation-items/${item.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
          viewAllLink="/dashboard/donation-items"
          createLink="/donation-items/new"
          createLabel="Donate Item"
        />
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="donations">Your Donations</TabsTrigger>
          <TabsTrigger value="drives">Community Drives</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-4">
          <DashboardActivityFeed />
        </TabsContent>
        <TabsContent value="donations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CircleDollarSign className="h-5 w-5 mr-2" />
                Your Recent Donations
              </CardTitle>
              <CardDescription>Donations you've made to campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {data.donations.length > 0 ? (
                <div className="space-y-4">
                  {data.donations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <h4 className="font-medium">{donation.campaign?.title || "Unknown Campaign"}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={donation.payment_status === "completed" ? "default" : "outline"}>
                            {donation.payment_status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${donation.amount?.toFixed(2)}</div>
                        {donation.is_recurring && (
                          <span className="text-xs text-muted-foreground">Monthly recurring</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You haven't made any donations yet</p>
                  <Button asChild>
                    <Link href="/campaigns">Browse Campaigns</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            {data.donations.length > 0 && (
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard/donations">View All Donations</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="drives" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Community Drives
              </CardTitle>
              <CardDescription>Community events you're organizing or participating in</CardDescription>
            </CardHeader>
            <CardContent>
              {data.communityDrives.length > 0 ? (
                <div className="space-y-4">
                  {data.communityDrives.map((drive) => (
                    <div key={drive.id} className="flex items-start border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-medium">{drive.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={drive.is_active ? "default" : "outline"}>
                            {drive.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(drive.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        {drive.location && (
                          <p className="text-xs text-muted-foreground mt-1">Location: {drive.location}</p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild className="ml-2">
                        <Link href={`/community-drives/${drive.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You're not part of any community drives yet</p>
                  <Button asChild>
                    <Link href="/community-drives">Browse Community Drives</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            {data.communityDrives.length > 0 && (
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard/community-drives">View All Community Drives</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DashboardSectionProps<T> {
  title: string
  description: string
  icon: React.ReactNode
  items: T[]
  emptyMessage: string
  renderItem: (item: T) => React.ReactNode
  viewAllLink: string
  createLink: string
  createLabel: string
}

function DashboardSection<T>({
  title,
  description,
  icon,
  items,
  emptyMessage,
  renderItem,
  viewAllLink,
  createLink,
  createLabel,
}: DashboardSectionProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="divide-y">{items.map((item) => renderItem(item))}</div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{emptyMessage}</p>
            <Button asChild>
              <Link href={createLink}>{createLabel}</Link>
            </Button>
          </div>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link href={viewAllLink}>View All</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
