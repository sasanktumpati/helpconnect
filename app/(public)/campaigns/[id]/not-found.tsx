import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, Search, ArrowLeft } from "lucide-react"

export default function CampaignNotFound() {
  return (
    <div className="container py-16 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="rounded-full bg-red-50 p-4 mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Campaign Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The campaign you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90 gap-2">
            <Link href="/campaigns">
              <Search className="h-4 w-4" />
              Browse Campaigns
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
