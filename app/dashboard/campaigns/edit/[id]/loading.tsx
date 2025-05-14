import { Skeleton } from "@/components/ui/skeleton"

export default function EditCampaignLoading() {
  return (
    <div className="container max-w-4xl py-8">
      <Skeleton className="h-8 w-64 mb-6" />

      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
