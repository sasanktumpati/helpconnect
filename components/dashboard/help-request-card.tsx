import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HelpRequest } from "@/lib/types"
import { Calendar, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface HelpRequestCardProps {
  helpRequest: HelpRequest
}

export function HelpRequestCard({ helpRequest }: HelpRequestCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge>{helpRequest.request_type}</Badge>
          <Badge
            variant={
              helpRequest.urgency_level === "critical"
                ? "destructive"
                : helpRequest.urgency_level === "high"
                  ? "destructive"
                  : helpRequest.urgency_level === "medium"
                    ? "default"
                    : "outline"
            }
          >
            {helpRequest.urgency_level}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1 mt-2">{helpRequest.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{helpRequest.description}</p>
        <div className="flex flex-col space-y-2 text-sm">
          {helpRequest.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="line-clamp-1">{helpRequest.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDistanceToNow(new Date(helpRequest.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/dashboard/help-requests/${helpRequest.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
