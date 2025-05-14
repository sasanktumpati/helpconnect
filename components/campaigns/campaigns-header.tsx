import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CampaignsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground mt-1">Browse and support campaigns from organizations and individuals.</p>
      </div>
      <Link href="/create-campaign">
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create Campaign</span>
        </Button>
      </Link>
    </div>
  )
}
