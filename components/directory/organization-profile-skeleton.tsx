import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function OrganizationProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />

              <Skeleton className="h-5 w-40 mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="pt-2">
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
