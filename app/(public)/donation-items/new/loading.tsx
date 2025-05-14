import { Skeleton } from "@/components/ui/skeleton"

export default function NewDonationItemLoading() {
  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-1/3 mt-6" />
        </div>
      </div>
    </div>
  )
}
