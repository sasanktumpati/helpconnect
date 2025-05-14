import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function DonationItemDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-10 w-32 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Skeleton className="w-full h-64 md:h-96 rounded-lg mb-6" />

          <Skeleton className="h-10 w-3/4 mb-4" />

          <div className="flex gap-2 mb-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>

          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-px w-full" />

            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                <Skeleton className="h-px w-full" />

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3 mt-0.5" />
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3 mt-0.5" />
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                </div>

                <Skeleton className="h-px w-full" />

                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
