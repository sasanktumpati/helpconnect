"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase/provider"
import type { Campaign, Donation, User } from "@/lib/types"
import { AlertCircle, Calendar, Clock, Edit, Heart, MapPin, Share2, Shield, UserIcon } from "lucide-react"
import { format, formatDistanceToNow, isAfter } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface CampaignDetailProps {
  id: string
}

export function CampaignDetail({ id }: CampaignDetailProps) {
  const { supabase, user } = useSupabase()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [creator, setCreator] = useState<User | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  const fetchCampaign = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("campaigns").select("*").eq("id", id).single()

      if (error) throw error
      if (!data) throw new Error("Campaign not found")

      setCampaign(data as Campaign)
      setIsOwner(user?.id === data.creator_id)

      // Fetch creator info
      const { data: creatorData, error: creatorError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.creator_id)
        .single()

      if (creatorError) throw creatorError
      setCreator(creatorData as User)

      // Fetch recent donations
      const { data: donationsData, error: donationsError } = await supabase
        .from("donations")
        .select("*")
        .eq("campaign_id", id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (donationsError) throw donationsError
      setDonations(donationsData as Donation[])
    } catch (err: any) {
      console.error("Error fetching campaign:", err)
      setError(err.message || "Failed to load campaign")
    } finally {
      setLoading(false)
    }
  }, [supabase, id, user?.id])

  useEffect(() => {
    fetchCampaign()
  }, [fetchCampaign])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign?.title || "HelpConnect Campaign",
        text: campaign?.description || "Check out this campaign on HelpConnect",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2 self-start">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading campaign</h3>
        <p className="text-sm text-muted-foreground mb-4">{error || "Campaign not found"}</p>
        <Button asChild>
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    )
  }

  const progress =
    campaign.target_amount && campaign.current_amount
      ? Math.min(Math.round((campaign.current_amount / campaign.target_amount) * 100), 100)
      : 0

  const isExpired = campaign.end_date ? isAfter(new Date(), new Date(campaign.end_date)) : false

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant={campaign.is_disaster_relief ? "destructive" : "secondary"}>
              {campaign.campaign_type?.replace("_", " ") || "Campaign"}
            </Badge>
            {campaign.urgency_level && (
              <Badge
                variant={
                  campaign.urgency_level === "critical"
                    ? "destructive"
                    : campaign.urgency_level === "high"
                      ? "destructive"
                      : campaign.urgency_level === "medium"
                        ? "default"
                        : "outline"
                }
              >
                {campaign.urgency_level}
              </Badge>
            )}
            {!campaign.is_active && <Badge variant="outline">Inactive</Badge>}
            {isExpired && <Badge variant="outline">Expired</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        <div className="flex gap-2 self-start">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          {isOwner && (
            <Button variant="outline" size="icon" asChild>
              <Link href={`/dashboard/campaigns/edit/${campaign.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          )}
          {campaign.is_active && !isExpired && campaign.campaign_type === "monetary" && (
            <Button asChild size="lg" className="bg-[#1249BF] hover:bg-[#1249BF]/90">
              <Link href={`/campaigns/${campaign.id}/donate`}>Donate Now</Link>
            </Button>
          )}
          {campaign.is_active && !isExpired && campaign.campaign_type !== "monetary" && (
            <Button onClick={() => router.push(`/campaigns/${campaign.id}/support`)}>Support</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {campaign.images && campaign.images.length > 0 ? (
              <img
                src={campaign.images[0] || "/placeholder.svg"}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="supporters">Supporters</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">About this Campaign</h2>
                <p className="whitespace-pre-line">{campaign.description}</p>
              </div>

              {campaign.is_disaster_relief && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Disaster Information</h3>
                  <div className="space-y-2">
                    {campaign.disaster_type && (
                      <div>
                        <span className="font-medium">Type:</span> {campaign.disaster_type}
                      </div>
                    )}
                    {campaign.affected_area && (
                      <div>
                        <span className="font-medium">Affected Area:</span> {campaign.affected_area}
                      </div>
                    )}
                    {campaign.immediate_needs && campaign.immediate_needs.length > 0 && (
                      <div>
                        <span className="font-medium">Immediate Needs:</span>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {campaign.immediate_needs.map((need, index) => (
                            <li key={index}>{need}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {campaign.location && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{campaign.location}</span>
                  </div>
                </div>
              )}

              {campaign.start_date && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Starts: {format(new Date(campaign.start_date), "PPP")}</span>
                    </div>
                    {campaign.end_date && (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Ends: {format(new Date(campaign.end_date), "PPP")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="updates">
              {isOwner ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Campaign Updates</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/campaigns/updates/new/${campaign.id}`}>Add Update</Link>
                    </Button>
                  </div>
                  <div className="py-8 text-center">
                    <h3 className="text-lg font-medium">No updates yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep your supporters informed by adding updates about your campaign.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium">No updates yet</h3>
                  <p className="text-sm text-muted-foreground">Check back later for updates on this campaign.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="supporters">
              {donations && donations.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recent Supporters</h3>
                  <div className="space-y-3">
                    {donations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {donation.is_anonymous ? "A" : donation.donor_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {donation.is_anonymous ? "Anonymous" : donation.donor_name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${donation.amount}</p>
                          {donation.is_recurring && (
                            <Badge variant="outline" className="text-xs">
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium">No supporters yet</h3>
                  <p className="text-sm text-muted-foreground">Be the first to support this campaign!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {campaign.campaign_type === "monetary" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">${campaign.current_amount?.toLocaleString() || "0"}</span>
                    <span className="text-muted-foreground">of ${campaign.target_amount?.toLocaleString() || "0"}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{progress}% of goal reached</p>
                </div>

                {campaign.is_active && !isExpired && (
                  <Button className="w-full bg-[#1249BF] hover:bg-[#1249BF]/90" asChild>
                    <Link href={`/campaigns/${campaign.id}/donate`}>Donate Now</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                {creator?.profile_image_url ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={creator.profile_image_url || "/placeholder.svg"}
                      alt={creator.display_name || "Campaign Organizer"}
                    />
                    <AvatarFallback>{creator.display_name?.[0] || "O"}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{creator?.display_name || "Anonymous"}</p>
                    {creator?.is_verified && <Shield className="h-4 w-4 text-[#1249BF]" />}
                  </div>
                  <p className="text-sm text-muted-foreground">Campaign Organizer</p>
                </div>
              </div>

              {creator && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/directory/${creator.id}`}>View Profile</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Share this campaign</h3>
              <p className="text-sm text-muted-foreground mb-4">Help spread the word and support this cause.</p>
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
