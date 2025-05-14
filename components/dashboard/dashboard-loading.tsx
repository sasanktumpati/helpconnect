export function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Stats Loading */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded-full"></div>
            </div>
            <div className="h-7 w-16 bg-muted rounded mt-2"></div>
            <div className="h-3 w-24 bg-muted rounded mt-2"></div>
          </div>
        ))}
      </div>

      {/* Sections Loading */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card animate-pulse">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-muted rounded-full"></div>
                <div className="h-5 w-32 bg-muted rounded"></div>
              </div>
              <div className="h-3 w-48 bg-muted rounded mt-2"></div>
            </div>
            <div className="p-6 space-y-6">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed Loading */}
      <div className="rounded-lg border bg-card animate-pulse">
        <div className="p-6 border-b">
          <div className="h-5 w-32 bg-muted rounded"></div>
          <div className="h-3 w-48 bg-muted rounded mt-2"></div>
        </div>
        <div className="p-6 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="h-9 w-9 rounded-full bg-muted"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/4 bg-muted rounded"></div>
                <div className="h-3 w-3/4 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
