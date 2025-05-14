import { Skeleton } from "@/components/ui/skeleton"

export function CampaignFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <Skeleton className="h-10 w-32" />
    </div>
  )
}
