import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CommunityDrive } from "@/lib/types"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"

interface CommunityDriveCardProps {
  communityDrive: CommunityDrive
}

export function CommunityDriveCard({ communityDrive }: CommunityDriveCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted">
        {communityDrive.images && communityDrive.images.length > 0 ? (
          <img
            src={communityDrive.images[0] || "/placeholder.svg"}
            alt={communityDrive.title}
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
          <Badge>{communityDrive.drive_type.replace("_", " ")}</Badge>
          <Badge variant={communityDrive.is_active ? "default" : "outline"}>
            {communityDrive.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1 mt-2">{communityDrive.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{communityDrive.description}</p>
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="line-clamp-1">{communityDrive.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{format(new Date(communityDrive.start_date), "PPP")}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {communityDrive.current_participants} / {communityDrive.participant_limit || "∞"} participants
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/dashboard/community-drives/${communityDrive.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
