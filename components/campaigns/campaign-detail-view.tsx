"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow, differenceInDays } from "date-fns"
import { Calendar, Clock, Heart, MapPin, Share2, Users, ArrowLeft, AlertTriangle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getDonations, getCampaigns } from "@/lib/supabase/database"
import type { Campaign, Donation, User } from "@/lib/types"
import { DonateDialog } from "@/components/campaigns/donate-dialog"
import { createClient } from "@/lib/supabase/client"

interface CampaignDetailViewProps {
  id: string
}

export function CampaignDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-8 w-64 mb-2" />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex gap-2 self-start mt-2 md:mt-0">
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-64 w-full" />

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="about">
                <Skeleton className="h-8 w-20" />
              </TabsTrigger>
              <TabsTrigger value="updates">
                <Skeleton className="h-8 w-20" />
              </TabsTrigger>
              <TabsTrigger value="supporters">
                <Skeleton className="h-8 w-20" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 pt-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </TabsContent>

            <TabsContent value="updates" className="pt-4">
              <Skeleton className="h-6 w-48" />
            </TabsContent>

            <TabsContent value="supporters" className="pt-4">
              <Skeleton className="h-6 w-48" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}

export function CampaignDetailView({ id }: CampaignDetailViewProps) {
  // const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [creator, setCreator] = useState<User | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [relatedCampaigns, setRelatedCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingDonations, setLoadingDonations] = useState(false)
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [donationStats, setDonationStats] = useState({
    totalDonors: 0,
    avgDonation: 0,
    recentActivity: 0,
  })
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch campaign data
  useEffect(() => {
    async function fetchCampaign() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("campaigns")
          .select("*, users!inner(display_name, profile_image_url, organization_name, is_verified)")
          .eq("id", id)
          .single()

        if (error) {
          console.error("Error fetching campaign:", error)
          setError("Failed to load campaign details. Please try again later.")
          return
        }

        if (!data) {
          setError("Campaign not found")
          return
        }

        setCampaign(data)
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [id, supabase])

  const fetchDonations = async () => {
    if (!id) return

    setLoadingDonations(true)

    try {
      // Use database function to get donations
      const result = await getDonations(10, 0, {
        campaign_id: id,
        payment_status: "completed",
      })

      // Check if result is valid and has data property
      if (!result || typeof result !== "object") {
        console.error("Invalid response format from getDonations:", result)
        setDonations([])
        return
      }

      const donations = result.data || []
      setDonations(donations)

      // Calculate donation stats
      if (donations.length > 0) {
        const uniqueDonors = new Set(donations.map((d) => d.donor_id).filter(Boolean)).size
        const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
        const avgDonation = donations.length > 0 ? totalAmount / donations.length : 0

        // Count donations in the last 7 days
        const now = new Date()
        const recentDonations = donations.filter((d) => {
          const donationDate = new Date(d.created_at)
          return differenceInDays(now, donationDate) <= 7
        }).length

        setDonationStats({
          totalDonors: uniqueDonors,
          avgDonation,
          recentActivity: recentDonations,
        })
      }
    } catch (err) {
      console.error("Error fetching donations:", err)
      // Set empty donations array to prevent UI errors
      setDonations([])
    } finally {
      setLoadingDonations(false)
    }
  }

  const fetchRelatedCampaigns = async (campaignType: string, currentId: string) => {
    if (!campaignType) return

    setLoadingRelated(true)

    try {
      // Use database function to get related campaigns
      const { data } = await getCampaigns(3, 0, {
        campaign_type: campaignType,
        is_active: true,
      })

      // Filter out current campaign
      const filteredCampaigns = data?.filter((campaign) => campaign.id !== currentId) || []
      setRelatedCampaigns(filteredCampaigns)
    } catch (err: any) {
      console.error("Error fetching related campaigns:", err)
    } finally {
      setLoadingRelated(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: campaign?.title || "Campaign",
          text: `Check out this campaign: ${campaign?.title || ""}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this campaign with others",
        })
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  const handleNextImage = () => {
    if (!campaign?.images || campaign.images.length <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % campaign.images.length)
  }

  const handlePrevImage = () => {
    if (!campaign?.images || campaign.images.length <= 1) return
    setCurrentImageIndex((prev) => (prev - 1 + campaign.images.length) % campaign.images.length)
  }

  const handleBookmark = async () => {
    // if (!user || !supabase || !campaign) {
    //   toast({
    //     title: "Sign in required",
    //     description: "Please sign in to bookmark campaigns",
    //     variant: "destructive",
    //   })
    //   return
    // }
    // try {
    //   if (isBookmarked) {
    //     // Remove bookmark
    //     await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("campaign_id", campaign.id)
    //     setIsBookmarked(false)
    //     toast({
    //       title: "Bookmark removed",
    //       description: "Campaign removed from your bookmarks",
    //     })
    //   } else {
    //     // Add bookmark
    //     await supabase.from("bookmarks").insert({
    //       user_id: user.id,
    //       campaign_id: campaign.id,
    //       created_at: new Date().toISOString(),
    //     })
    //     setIsBookmarked(true)
    //     toast({
    //       title: "Campaign bookmarked",
    //       description: "Campaign added to your bookmarks",
    //     })
    //   }
    // } catch (error) {
    //   console.error("Error toggling bookmark:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update bookmark status",
    //     variant: "destructive",
    //   })
    // }
  }

  if (loading) {
    return <CampaignDetailSkeleton />
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="text-2xl font-bold">Error Loading Campaign</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/campaigns">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  if (!campaign) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="text-2xl font-bold">Campaign Not Found</h2>
          <p className="text-muted-foreground">
            The campaign you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild className="mt-4">
            <Link href="/campaigns">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  const progress = Math.min(100, (campaign.current_amount / campaign.target_amount) * 100)
  const formattedProgress = progress.toFixed(1)
  const remainingAmount = Math.max(0, campaign.target_amount - campaign.current_amount)
  const createdAt = new Date(campaign.created_at)
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })
  const organizationName = campaign.users.organization_name || campaign.users.display_name

  // const progress = campaign.target_amount
  //   ? Math.min(Math.round((campaign.current_amount / campaign.target_amount) * 100), 100)
  //   : 0

  // const isExpired = campaign.end_date ? isAfter(new Date(), new Date(campaign.end_date)) : false
  // const hasMultipleImages = campaign.images && campaign.images.length > 1
  // const daysLeft = campaign.end_date ? differenceInDays(new Date(campaign.end_date), new Date()) : null

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/campaigns"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Campaigns
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {campaign.users.profile_image_url ? (
                <Image
                  src={campaign.users.profile_image_url || "/placeholder.svg"}
                  alt={organizationName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              )}
              <span className="text-sm font-medium">
                {organizationName}
                {campaign.users.is_verified && (
                  <Badge variant="outline" className="ml-1 py-0 px-1 text-xs bg-blue-50 text-blue-600 border-blue-200">
                    Verified
                  </Badge>
                )}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Created {timeAgo}</span>
          </div>
        </div>

        {campaign.images && campaign.images.length > 0 && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={campaign.images[0] || "/placeholder.svg"}
              alt={campaign.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
            />
          </div>
        )}

        {/* Campaign Owner Controls */}
        {/* {isOwner && <CampaignStatusManager campaign={campaign} />} */}

        {/* Campaign Details Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <p>{campaign.description}</p>
            </div>

            {campaign.location && (
              <div className="flex items-start gap-2 mt-4">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm text-muted-foreground">{campaign.location}</p>
                </div>
              </div>
            )}

            {campaign.is_disaster_relief && (
              <div className="flex items-start gap-2 mt-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Disaster Relief</h3>
                  <p className="text-sm text-muted-foreground">
                    This campaign is for disaster relief in {campaign.affected_area || "affected areas"}.
                    {campaign.disaster_type && ` Type: ${campaign.disaster_type}`}
                  </p>
                </div>
              </div>
            )}

            {campaign.immediate_needs && campaign.immediate_needs.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Immediate Needs</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.immediate_needs.map((need: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="updates" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Updates Yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Check back later for updates on this campaign.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Comments Yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Be the first to comment on this campaign.</p>
                  <Button className="mt-4" variant="outline">
                    Leave a Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">${campaign.current_amount.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">
                  raised of ${campaign.target_amount.toLocaleString()} goal
                </p>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="flex justify-between text-sm">
                <span>{formattedProgress}% Complete</span>
                <span>${remainingAmount.toLocaleString()} to go</span>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <DonateDialog campaign={campaign} />

                <Button variant="outline" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>

                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Campaign Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Campaign Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{campaign.campaign_type || "General"}</p>
                </div>
              </div>

              {campaign.start_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(campaign.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {campaign.end_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">{new Date(campaign.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {campaign.urgency_level && (
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      campaign.urgency_level === "high"
                        ? "text-red-500"
                        : campaign.urgency_level === "medium"
                          ? "text-amber-500"
                          : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">Urgency Level</p>
                    <p className="text-sm text-muted-foreground capitalize">{campaign.urgency_level}</p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href={`/campaigns/${id}/donate`}
                  className="flex items-center justify-center w-full gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Donation Page
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
