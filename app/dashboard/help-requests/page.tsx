import { Suspense } from "react"
import { DashboardHelpRequests } from "@/components/dashboard/help-requests/dashboard-help-requests"
import { DashboardHelpRequestsLoading } from "@/components/dashboard/help-requests/dashboard-help-requests-loading"

export const metadata = {
  title: "My Help Requests | HelpConnect",
  description: "Manage your help requests on HelpConnect",
}

export default function HelpRequestsPage() {
  return (
    <Suspense fallback={<DashboardHelpRequestsLoading />}>
      <DashboardHelpRequests />
    </Suspense>
  )
}
