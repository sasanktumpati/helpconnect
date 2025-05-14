"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSupabase } from "@/lib/supabase/provider"
import { CheckCircle2, Circle, User } from "lucide-react"
import type { User as UserType } from "@/lib/types"

export function ProfileCompletionGuide() {
  const { supabase, user } = useSupabase()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [completionSteps, setCompletionSteps] = useState<{ title: string; completed: boolean }[]>([])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) throw error

        setUserProfile(data as UserType)

        // Calculate completion percentage and steps
        const steps = [
          { title: "Basic Information", completed: !!data.display_name && !!data.location },
          {
            title: "Contact Information",
            completed: !!data.email && (!!data.phone_number || data.role === "individual"),
          },
        ]

        if (data.role === "ngo" || data.role === "organization") {
          steps.push(
            {
              title: "Organization Details",
              completed: !!data.organization_name && !!data.organization_type && !!data.mission_statement,
            },
            {
              title: "Areas of Focus",
              completed: Array.isArray(data.areas_of_focus) && data.areas_of_focus.length > 0,
            },
          )
        }

        setCompletionSteps(steps)

        // Calculate percentage
        const completedSteps = steps.filter((step) => step.completed).length
        const percentage = Math.round((completedSteps / steps.length) * 100)
        setCompletionPercentage(percentage)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [supabase, user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-3/4 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-1/2 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-4 w-full rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="animate-pulse bg-muted h-5 w-5 rounded-full"></div>
                <div className="animate-pulse bg-muted h-4 w-3/4 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
        </CardFooter>
      </Card>
    )
  }

  if (!userProfile) {
    return null
  }

  // If profile is already completed, don't show the guide
  if (userProfile.profile_completed) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Your profile is {completionPercentage}% complete. Finish setting up your profile to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionPercentage} className="h-2" />

        <div className="space-y-2">
          {completionSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={step.completed ? "text-primary font-medium" : "text-muted-foreground"}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => router.push("/dashboard/profile/complete")}>
          <User className="mr-2 h-4 w-4" />
          Complete Your Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
