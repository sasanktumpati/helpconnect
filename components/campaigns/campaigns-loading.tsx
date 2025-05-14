import { Skeleton } from "@/components/ui/skeleton"

export function CampaignsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <div className="flex flex-col space-y-2 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}
