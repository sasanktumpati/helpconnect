import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function DonationItemsHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Items for Donation</h1>
        <p className="text-muted-foreground mt-1">
          Browse items available for donation from individuals and organizations.
        </p>
      </div>
      <Button className="bg-[#1249BF] hover:bg-[#1249BF]/90" asChild>
        <Link href="/donation-items/new">
          <Plus className="mr-2 h-4 w-4" />
          Donate an Item
        </Link>
      </Button>
    </div>
  )
}
