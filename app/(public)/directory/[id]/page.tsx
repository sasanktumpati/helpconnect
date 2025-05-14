import { Suspense } from "react"
import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { OrganizationProfile } from "@/components/directory/organization-profile"
import { OrganizationProfileSkeleton } from "@/components/directory/organization-profile-skeleton"

interface OrganizationPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: OrganizationPageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: organization } = await supabase
      .from("users")
      .select("organization_name, display_name, bio")
      .eq("id", params.id)
      .single()

    if (!organization) {
      return {
        title: "Organization Not Found | HelpConnect",
        description: "The requested organization could not be found.",
      }
    }

    const name = organization.organization_name || organization.display_name

    return {
      title: `${name} | HelpConnect`,
      description: organization.bio?.substring(0, 160) || `Learn more about ${name} and their work.`,
    }
  } catch (error) {
    return {
      title: "Organization | HelpConnect",
      description: "View organization profile and their work.",
    }
  }
}

export default function OrganizationPage({ params }: OrganizationPageProps) {
  return (
    <div className="container py-8">
      <Suspense fallback={<OrganizationProfileSkeleton />}>
        <OrganizationProfile id={params.id} />
      </Suspense>
    </div>
  )
}
