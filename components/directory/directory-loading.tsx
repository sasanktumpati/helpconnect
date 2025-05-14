import { Skeleton } from "@/components/ui/skeleton"

export function DirectoryLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <Skeleton className="h-4 w-full mt-2" />
            <div className="flex flex-wrap gap-2 mt-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}
