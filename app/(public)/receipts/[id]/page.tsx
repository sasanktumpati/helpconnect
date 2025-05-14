import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ReceiptActions from "@/components/receipts/receipt-actions"

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: donation, error } = await supabase
    .from("donations")
    .select(`
      *,
      campaign:campaigns(
        id,
        title,
        creator_id,
        users:profiles(
          display_name,
          organization_name
        )
      )
    `)
    .eq("transaction_id", params.id)
    .single()

  if (error || !donation) {
    notFound()
  }

  const campaignName = donation.campaign?.title || "Unknown Campaign"
  const organizationName =
    donation.campaign?.users?.organization_name || donation.campaign?.users?.display_name || "Unknown Organization"

  return (
    <div className="container max-w-2xl py-12">
      <Card className="border-2">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex justify-between items-center">
            <CardTitle>Donation Receipt</CardTitle>
            <div className="text-sm text-muted-foreground">
              <div>Receipt #{params.id}</div>
              <div>Date: {new Date(donation.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          <CardDescription>Thank you for your generous contribution</CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Donation Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">Amount</div>
                <div className="text-xl font-bold">${donation.amount?.toFixed(2)}</div>
              </div>

              <div className="space-y-1">
                <div className="font-medium">Payment Method</div>
                <div className="capitalize">{donation.payment_method?.replace("_", " ") || "N/A"}</div>
              </div>

              <div className="space-y-1">
                <div className="font-medium">Campaign</div>
                <div>{campaignName}</div>
              </div>

              <div className="space-y-1">
                <div className="font-medium">Organization</div>
                <div>{organizationName}</div>
              </div>

              <div className="space-y-1">
                <div className="font-medium">Transaction ID</div>
                <div className="text-xs text-muted-foreground">{donation.transaction_id}</div>
              </div>

              <div className="space-y-1">
                <div className="font-medium">Status</div>
                <div className="capitalize">{donation.payment_status}</div>
              </div>

              {donation.is_recurring && (
                <div className="space-y-1 col-span-2">
                  <div className="font-medium">Recurring Donation</div>
                  <div>This is a {donation.frequency} recurring donation</div>
                </div>
              )}
            </div>
          </div>

          {donation.message && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Your Message</h3>
              <div className="p-4 bg-muted/50 rounded-md italic text-sm">"{donation.message}"</div>
            </div>
          )}

          <div className="pt-4 text-sm text-muted-foreground">
            <p>This receipt serves as confirmation of your donation. Please keep it for your tax records.</p>
            <p className="mt-2">Thank you for your support!</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t pt-6">
          <Button asChild className="w-full">
            <Link href={`/campaigns/${donation.campaign_id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Campaign
            </Link>
          </Button>
          <ReceiptActions />
        </CardFooter>
      </Card>
    </div>
  )
}
