import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { DonationForm } from "@/components/donations/donation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface DonatePageProps {
  params: {
    id: string
  }
}

async function DonationFormWrapper({ campaignId }: { campaignId: string }) {
  const supabase = createClient()

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*, users!inner(display_name, organization_name, is_verified)")
    .eq("id", campaignId)
    .single()

  if (error || !campaign) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Not Found</CardTitle>
          <CardDescription>The campaign you're looking for doesn't exist or has been removed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/campaigns" className="flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donate to {campaign.title}</CardTitle>
        <CardDescription>
          Support {campaign.users.organization_name || campaign.users.display_name}
          {campaign.users.is_verified && " ✓"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Campaign Goal:</span>
            <span className="text-sm">${campaign.target_amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-medium">Raised So Far:</span>
            <span className="text-sm">${campaign.current_amount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (campaign.current_amount / campaign.target_amount) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
        <DonationForm campaign={campaign} />
      </CardContent>
    </Card>
  )
}

export default function DonatePage({ params }: DonatePageProps) {
  return (
    <div className="container max-w-lg py-10">
      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        }
      >
        <DonationFormWrapper campaignId={params.id} />
      </Suspense>
    </div>
  )
}
