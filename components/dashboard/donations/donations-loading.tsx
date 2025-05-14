import { Skeleton } from "@/components/ui/skeleton"

export function DonationsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left font-medium">Date</th>
                <th className="h-12 px-4 text-left font-medium">Campaign</th>
                <th className="h-12 px-4 text-left font-medium">Amount</th>
                <th className="h-12 px-4 text-left font-medium">Status</th>
                <th className="h-12 px-4 text-left font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4 align-middle">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="p-4 align-middle">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="p-4 align-middle">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="p-4 align-middle">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="p-4 align-middle">
                    <Skeleton className="h-8 w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
