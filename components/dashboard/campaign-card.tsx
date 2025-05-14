import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Campaign } from "@/lib/types"
import { Calendar, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted">
        {campaign.images && campaign.images.length > 0 ? (
          <img
            src={campaign.images[0] || "/placeholder.svg"}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge variant={campaign.is_disaster_relief ? "destructive" : "secondary"}>
            {campaign.campaign_type.replace("_", " ")}
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
        </div>
        <CardTitle className="line-clamp-1 mt-2">{campaign.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{campaign.description}</p>
        <div className="flex flex-col space-y-2 text-sm">
          {campaign.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="line-clamp-1">{campaign.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
