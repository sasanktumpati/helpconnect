import { Suspense } from "react"
import { InventoryHeader } from "@/components/inventory/inventory-header"
import { InventoryFilters } from "@/components/inventory/inventory-filters"
import { InventoryList } from "@/components/inventory/inventory-list"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Inventory Management | HelpConnect",
  description: "Manage your inventory items on HelpConnect",
}

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <InventoryHeader />
      <Suspense fallback={<FiltersSkeleton />}>
        <InventoryFilters />
      </Suspense>
      <Suspense fallback={<InventoryLoading />}>
        <InventoryList />
      </Suspense>
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>
      <div className="flex justify-end mt-4">
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  )
}

function InventoryLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4 mt-4" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          </div>
        ))}
    </div>
  )
}
