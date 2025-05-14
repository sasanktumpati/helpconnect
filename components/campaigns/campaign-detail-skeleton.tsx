import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function CampaignDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-4">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Campaign Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex gap-2 mb-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-10 w-64 md:w-96 mb-2" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2 self-start">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Image */}
          <Skeleton className="aspect-video w-full rounded-xl" />

          {/* Campaign Tabs */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>

            <div className="space-y-4 pt-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Impact Section Skeleton */}
            <div className="pt-8">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Campaign Progress */}
          <Card>
            <div className="h-12 px-6 border-b">
              <Skeleton className="h-5 w-40 mt-3" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between mt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Campaign Status */}
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Organizer */}
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mt-4" />
              <Skeleton className="h-4 w-32 mt-3" />
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          {/* Campaign Stats */}
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Campaign */}
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
