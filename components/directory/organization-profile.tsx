"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase/provider"
import type { Campaign, CommunityDrive, User } from "@/lib/types"
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Users,
} from "lucide-react"
import { CampaignCard } from "@/components/dashboard/campaign-card"
import { CommunityDriveCard } from "@/components/dashboard/community-drive-card"

interface OrganizationProfileProps {
  id: string
}

export function OrganizationProfile({ id }: OrganizationProfileProps) {
  const { supabase } = useSupabase()
  const [organization, setOrganization] = useState<User | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [communityDrives, setCommunityDrives] = useState<CommunityDrive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrganizationData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch organization profile
        const { data: orgData, error: orgError } = await supabase.from("users").select("*").eq("id", id).single()

        if (orgError) throw orgError
        if (!orgData) throw new Error("Organization not found")

        setOrganization(orgData as User)

        // Fetch campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
          .from("campaigns")
          .select("*")
          .eq("creator_id", id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(3)

        if (campaignsError) throw campaignsError
        setCampaigns(campaignsData as Campaign[])

        // Fetch community drives
        const { data: drivesData, error: drivesError } = await supabase
          .from("community_drives")
          .select("*")
          .eq("organizer_id", id)
          .eq("is_active", true)
          .order("start_date", { ascending: true })
          .limit(3)

        if (drivesError) throw drivesError
        setCommunityDrives(drivesData as CommunityDrive[])
      } catch (err: any) {
        setError(err.message || "Failed to load organization profile")
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizationData()
  }, [supabase, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !organization) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading organization profile</h3>
        <p className="text-sm text-muted-foreground mb-4">{error || "Organization not found"}</p>
        <Button asChild>
          <Link href="/directory">Back to Directory</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {organization.organization_name || organization.display_name}
            </h1>
            {organization.is_verified && <CheckCircle2 className="h-6 w-6 text-primary" />}
          </div>
          <p className="text-muted-foreground capitalize">{organization.role}</p>
        </div>
        <div className="flex gap-2 self-start">
          <Button asChild>
            <Link href={`/campaigns?creator=${id}`}>View All Campaigns</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.mission_statement && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Mission Statement</h3>
                  <p className="whitespace-pre-line">{organization.mission_statement}</p>
                </div>
              )}

              {organization.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About Us</h3>
                  <p className="whitespace-pre-line">{organization.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="campaigns">
            <TabsList>
              <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
              <TabsTrigger value="drives">Community Drives</TabsTrigger>
            </TabsList>
            <TabsContent value="campaigns" className="space-y-4">
              {campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No active campaigns at the moment.</p>
                  </CardContent>
                </Card>
              )}

              {campaigns.length > 0 && (
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href={`/campaigns?creator=${id}`}>View All Campaigns</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="drives" className="space-y-4">
              {communityDrives.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communityDrives.map((drive) => (
                    <CommunityDriveCard key={drive.id} communityDrive={drive} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No upcoming community drives at the moment.</p>
                  </CardContent>
                </Card>
              )}

              {communityDrives.length > 0 && (
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href={`/community-drives?organizer=${id}`}>View All Community Drives</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organization.organization_type && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground">{organization.organization_type}</p>
                  </div>
                </div>
              )}

              {organization.year_established && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Established</p>
                    <p className="text-sm text-muted-foreground">{organization.year_established}</p>
                  </div>
                </div>
              )}

              {organization.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{organization.location}</p>
                  </div>
                </div>
              )}

              {(organization.staff_count !== undefined || organization.volunteer_count !== undefined) && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Team</p>
                    <p className="text-sm text-muted-foreground">
                      {organization.staff_count !== undefined && `${organization.staff_count} staff members`}
                      {organization.staff_count !== undefined && organization.volunteer_count !== undefined && ", "}
                      {organization.volunteer_count !== undefined && `${organization.volunteer_count} volunteers`}
                    </p>
                  </div>
                </div>
              )}

              {organization.areas_of_focus && organization.areas_of_focus.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Areas of Focus</p>
                  <div className="flex flex-wrap gap-2">
                    {organization.areas_of_focus.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organization.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{organization.phone_number}</span>
                </div>
              )}

              {organization.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{organization.email}</span>
                </div>
              )}

              {organization.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline"
                  >
                    {organization.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}

              {organization.social_media && Object.keys(organization.social_media).length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Social Media</p>
                  <div className="flex gap-2">
                    {organization.social_media.facebook && (
                      <a
                        href={organization.social_media.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                      </a>
                    )}
                    {organization.social_media.twitter && (
                      <a
                        href={organization.social_media.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    )}
                    {organization.social_media.instagram && (
                      <a
                        href={organization.social_media.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                      </a>
                    )}
                    {organization.social_media.linkedin && (
                      <a
                        href={organization.social_media.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
