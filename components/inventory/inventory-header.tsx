import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function InventoryHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">
          Manage your inventory items, track availability, and set minimum thresholds.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/inventory/new">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Link>
      </Button>
    </div>
  )
}
