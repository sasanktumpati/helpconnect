import { Skeleton } from "@/components/ui/skeleton"

export default function NewCampaignLoading() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-2/3 mb-2" />
        <Skeleton className="h-5 w-full mb-8" />

        <div className="space-y-8">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>

          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>

          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
