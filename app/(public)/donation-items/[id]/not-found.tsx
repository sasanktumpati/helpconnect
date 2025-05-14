import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package } from "lucide-react"

export default function DonationItemNotFound() {
  return (
    <div className="container py-12">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
        <div className="bg-muted rounded-full p-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Item Not Found</h1>
        <p className="text-muted-foreground">
          The donation item you're looking for doesn't exist or is no longer available.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/donation-items">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Items
            </Link>
          </Button>
          <Button className="w-full bg-[#1249BF] hover:bg-[#1249BF]/90" asChild>
            <Link href="/dashboard/donation-items/new">Donate an Item</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
