import { Suspense } from "react"
import type { Metadata } from "next"
import { DirectoryList } from "@/components/directory/directory-list"
import { DirectoryHeader } from "@/components/directory/directory-header"
import { DirectoryFilters } from "@/components/directory/directory-filters"
import { DirectoryLoading } from "@/components/directory/directory-loading"

export const metadata: Metadata = {
  title: "NGO & Organization Directory | HelpConnect",
  description: "Browse and discover NGOs and organizations on HelpConnect.",
}

export default function DirectoryPage() {
  return (
    <div className="container py-8">
      <DirectoryHeader />
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="md:w-1/4">
          <Suspense fallback={<div className="p-6 border rounded-lg bg-background animate-pulse h-96"></div>}>
            <DirectoryFilters />
          </Suspense>
        </div>
        <div className="md:w-3/4">
          <Suspense fallback={<DirectoryLoading />}>
            <DirectoryList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
