import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { InventoryItem } from "@/lib/types"
import { Package, MapPin, AlertTriangle } from "lucide-react"

interface InventoryItemCardProps {
  item: InventoryItem
}

export function InventoryItemCard({ item }: InventoryItemCardProps) {
  const isBelowThreshold = item.min_threshold !== null && item.quantity < item.min_threshold

  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted">
        {item.images && item.images.length > 0 ? (
          <img src={item.images[0] || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge variant={item.is_needed ? "destructive" : item.is_available ? "default" : "outline"}>
            {item.is_needed ? "Needed" : item.is_available ? "Available" : "Unavailable"}
          </Badge>
          <Badge variant="secondary">{item.category}</Badge>
        </div>
        <CardTitle className="line-clamp-1 mt-2">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity:</span>
            <span className={isBelowThreshold ? "text-destructive font-medium" : ""}>
              {item.quantity} {isBelowThreshold && <AlertTriangle className="inline h-4 w-4 ml-1" />}
            </span>
          </div>
          {item.min_threshold !== null && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Min Threshold:</span>
              <span>{item.min_threshold}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/dashboard/inventory/${item.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
