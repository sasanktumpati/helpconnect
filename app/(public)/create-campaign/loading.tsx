import { CampaignFormSkeleton } from "@/components/campaigns/campaign-form-skeleton"

export default function CreateCampaignLoading() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create a Campaign</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below to create a new campaign and start raising support.
        </p>

        <CampaignFormSkeleton />
      </div>
    </div>
  )
}
