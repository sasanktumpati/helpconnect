import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ExternalLink, Edit } from "lucide-react"
import type { DonationItem } from "@/lib/types"

interface DonationItemCardProps {
  item: DonationItem
}

export function DonationItemCard({ item }: DonationItemCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Map condition to human-readable text and badge variant
  const conditionMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    new: { label: "New", variant: "default" },
    like_new: { label: "Like New", variant: "default" },
    good: { label: "Good", variant: "secondary" },
    fair: { label: "Fair", variant: "secondary" },
    poor: { label: "Poor", variant: "outline" },
  }

  const condition = conditionMap[item.condition] || { label: "Unknown", variant: "outline" }

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <div className="h-48 bg-muted flex items-center justify-center">
          {/* Placeholder image or actual image if available */}
          <img
            src={item.images?.[0] || `/placeholder.svg?height=192&width=384&query=donation item ${item.category}`}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          {/* Visibility badge */}
          <Badge variant={item.is_available ? "default" : "secondary"} className="absolute top-2 right-2 px-2 py-1">
            {item.is_available ? (
              <>
                <Eye className="h-3 w-3 mr-1" /> Visible
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" /> Hidden
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={condition.variant}>{condition.label}</Badge>
          <Badge variant="outline">{formatCategory(item.category)}</Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {item.description || "No description provided."}
        </p>
        <div className="text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium">{item.quantity}</span>
          </div>
          {item.location && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{item.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1">
            <span className="text-muted-foreground">Added:</span>
            <span>{formatDate(item.created_at)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/dashboard/donation-items/edit/${item.id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <Button className="flex-1 bg-[#1249BF] hover:bg-[#1249BF]/90" asChild>
          <Link href={`/donation-items/${item.id}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
