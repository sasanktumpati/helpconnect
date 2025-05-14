import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DonationItem } from "@/lib/types"
import { MapPin, Package, User, Calendar } from "lucide-react"
import { format } from "date-fns"

interface PublicDonationItemCardProps {
  item: DonationItem & {
    users?: {
      display_name: string
      profile_image_url?: string
      is_verified: boolean
    }
  }
}

export function PublicDonationItemCard({ item }: PublicDonationItemCardProps) {
  const conditionColor = {
    new: "bg-green-100 text-green-800",
    like_new: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-gray-100 text-gray-800",
  }

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="h-48 bg-muted flex items-center justify-center">
          {item.images && item.images.length > 0 ? (
            <img src={item.images[0] || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant={conditionColor[item.condition] ? "default" : "outline"}
            className={conditionColor[item.condition]}
          >
            {item.condition.replace("_", " ")}
          </Badge>
          <Badge variant="outline">{formatCategory(item.category)}</Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description || "No description provided."}
        </p>
        <div className="space-y-2 text-sm">
          {item.location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{item.location}</span>
            </div>
          )}
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            <span>{item.users?.display_name || "Anonymous"}</span>
            {item.users?.is_verified && (
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Posted {format(new Date(item.created_at), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-[#1249BF] hover:bg-[#1249BF]/90" asChild>
          <Link href={`/donation-items/${item.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
