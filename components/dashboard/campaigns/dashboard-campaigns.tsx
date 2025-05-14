"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase/provider"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Edit, Plus } from "lucide-react"
import { format, isAfter } from "date-fns"
import type { Campaign } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

export function DashboardCampaigns() {
  const { supabase, user } = useSupabase()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("campaigns")
          .select("*")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setCampaigns(data as Campaign[])
      } catch (err: any) {
        console.error("Error fetching campaigns:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [supabase, user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Campaigns</h1>
            <p className="text-muted-foreground">Manage your fundraising campaigns and initiatives</p>
          </div>
          <Button asChild>
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-20 bg-muted rounded mb-2"></div>
                <div className="h-6 w-full bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded mb-4"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 w-full bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading campaigns</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Campaigns</h1>
          <p className="text-muted-foreground">Manage your fundraising campaigns and initiatives</p>
        </div>
        <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Create your first campaign to start raising funds or gathering support for your cause.
            </p>
            <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
              <Link href="/campaigns/new">Create Campaign</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const isExpired = campaign.end_date ? isAfter(new Date(), new Date(campaign.end_date)) : false
            const progress =
              campaign.target_amount && campaign.current_amount
                ? Math.min(Math.round((campaign.current_amount / campaign.target_amount) * 100), 100)
                : 0

            return (
              <Card key={campaign.id} className={!campaign.is_active ? "opacity-70" : undefined}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <Badge variant={campaign.is_disaster_relief ? "destructive" : "secondary"}>
                      {campaign.campaign_type?.replace("_", " ") || "Campaign"}
                    </Badge>
                    {!campaign.is_active && <Badge variant="outline">Inactive</Badge>}
                    {isExpired && <Badge variant="outline">Expired</Badge>}
                  </div>
                  <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                  <CardDescription>Created on {format(new Date(campaign.created_at), "MMM d, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {campaign.campaign_type === "monetary" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>${campaign.current_amount?.toLocaleString() || "0"}</span>
                        <span className="text-muted-foreground">
                          of ${campaign.target_amount?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/campaigns/${campaign.id}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/campaigns/edit/${campaign.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
