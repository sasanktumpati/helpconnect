import type { Metadata } from "next"
import DashboardClientPage from "./dashboard-client-page"

export const metadata: Metadata = {
  title: "Dashboard | HelpConnect",
  description: "Your HelpConnect dashboard overview",
}

export default function DashboardPage() {
  return <DashboardClientPage />
}
