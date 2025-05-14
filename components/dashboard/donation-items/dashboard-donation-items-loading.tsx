export function DashboardDonationItemsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Donation Items</h1>
          <p className="text-muted-foreground">Manage items you've listed for donation</p>
        </div>
        <div className="h-10 w-40 bg-muted rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-muted"></div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-muted rounded"></div>
                <div className="h-5 w-20 bg-muted rounded"></div>
              </div>
              <div className="h-6 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="flex gap-2">
                <div className="h-9 w-full bg-muted rounded"></div>
                <div className="h-9 w-full bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
