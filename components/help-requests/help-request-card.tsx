import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HelpRequest } from "@/lib/types"
import { MapPin, AlertTriangle, Clock, User } from "lucide-react"
import { format } from "date-fns"

interface HelpRequestCardProps {
  helpRequest: HelpRequest
  showActions?: boolean
}

export function HelpRequestCard({ helpRequest, showActions = true }: HelpRequestCardProps) {
  const urgencyColor = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    fulfilled: "bg-green-100 text-green-800",
  }

  return (
    <Card className={!helpRequest.is_active ? "opacity-70" : undefined}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 mb-1">
          <Badge variant="secondary">{helpRequest.request_type.replace("_", " ")}</Badge>
          <Badge className={urgencyColor[helpRequest.urgency_level]}>
            {helpRequest.urgency_level === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
            {helpRequest.urgency_level}
          </Badge>
          {!helpRequest.is_active && <Badge variant="outline">Inactive</Badge>}
          <Badge className={statusColor[helpRequest.status]}>{helpRequest.status.replace("_", " ")}</Badge>
        </div>
        <CardTitle className="line-clamp-1">{helpRequest.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Posted {format(new Date(helpRequest.created_at), "MMM d, yyyy")}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {helpRequest.location && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{helpRequest.location}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">{helpRequest.description}</p>
        {helpRequest.contact_info && (
          <div className="flex items-center text-sm mt-2">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Contact: {helpRequest.contact_info.name}</span>
          </div>
        )}
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/help-requests/${helpRequest.id}`}>View Details</Link>
          </Button>
          <Button variant="default" size="sm" className="flex-1" asChild>
            <Link href={`/help-requests/${helpRequest.id}/respond`}>Respond</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
