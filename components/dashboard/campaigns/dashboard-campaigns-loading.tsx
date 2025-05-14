export function DashboardCampaignsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Campaigns</h1>
          <p className="text-muted-foreground">Manage your fundraising campaigns and initiatives</p>
        </div>
        <div className="h-10 w-40 bg-muted rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4 animate-pulse">
            <div className="h-5 w-20 bg-muted rounded mb-2"></div>
            <div className="h-6 w-full bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="h-9 w-full bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
