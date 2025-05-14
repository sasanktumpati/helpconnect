import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import { Building2, MapPin, Users, CheckCircle2 } from "lucide-react"

interface OrganizationCardProps {
  organization: User
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold">{organization.organization_name || organization.display_name}</h3>
              {organization.is_verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground capitalize">{organization.role}</p>
          </div>
        </div>

        {organization.mission_statement && (
          <p className="text-sm line-clamp-3 mb-4">{organization.mission_statement}</p>
        )}

        <div className="space-y-2 text-sm mb-4">
          {organization.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{organization.location}</span>
            </div>
          )}
          {organization.staff_count !== undefined && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{organization.staff_count} staff members</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {organization.areas_of_focus?.slice(0, 3).map((area, index) => (
            <Badge key={index} variant="secondary">
              {area}
            </Badge>
          ))}
          {organization.areas_of_focus && organization.areas_of_focus.length > 3 && (
            <Badge variant="outline">+{organization.areas_of_focus.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/directory/${organization.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
