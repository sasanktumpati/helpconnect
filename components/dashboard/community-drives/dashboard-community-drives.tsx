"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase/provider"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Edit, MapPin, Plus } from "lucide-react"
import { format, isAfter, isBefore } from "date-fns"

interface CommunityDrive {
  id: string
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  organizer_id: string
  drive_type: string
  image_url?: string
}

export function DashboardCommunityDrives() {
  const { supabase, user } = useSupabase()
  const [drives, setDrives] = useState<CommunityDrive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDrives = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("community_drives")
          .select("*")
          .eq("organizer_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setDrives(data as CommunityDrive[])
      } catch (err: any) {
        console.error("Error fetching community drives:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDrives()
  }, [supabase, user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Community Drives</h1>
            <p className="text-muted-foreground">Manage your community events and volunteer opportunities</p>
          </div>
          <Button asChild>
            <Link href="/community-drives/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Drive
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-20 bg-muted rounded mb-2"></div>
                <div className="h-6 w-full bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded mb-4"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 w-full bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading community drives</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Community Drives</h1>
          <p className="text-muted-foreground">Manage your community events and volunteer opportunities</p>
        </div>
        <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
          <Link href="/community-drives/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Drive
          </Link>
        </Button>
      </div>

      {drives.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">No community drives yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Create your first community drive to organize events and volunteer opportunities.
            </p>
            <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
              <Link href="/community-drives/new">Create Drive</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => {
            const now = new Date()
            const startDate = new Date(drive.start_date)
            const endDate = drive.end_date ? new Date(drive.end_date) : null

            const isUpcoming = isBefore(now, startDate)
            const isActive = endDate ? isBefore(now, endDate) && isAfter(now, startDate) : isAfter(now, startDate)
            const isPast = endDate ? isAfter(now, endDate) : false

            return (
              <Card key={drive.id} className={!drive.is_active ? "opacity-70" : undefined}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <Badge variant="secondary">{drive.drive_type?.replace("_", " ") || "Community Drive"}</Badge>
                    {isUpcoming && <Badge>Upcoming</Badge>}
                    {isActive && <Badge variant="default">Active</Badge>}
                    {isPast && <Badge variant="outline">Past</Badge>}
                    {!drive.is_active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  <CardTitle className="line-clamp-1">{drive.title}</CardTitle>
                  <CardDescription>Created on {format(new Date(drive.created_at), "MMM d, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {format(new Date(drive.start_date), "MMM d, yyyy")}
                      {drive.end_date && ` - ${format(new Date(drive.end_date), "MMM d, yyyy")}`}
                    </span>
                  </div>
                  {drive.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{drive.location}</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{drive.description}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/community-drives/${drive.id}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/community-drives/edit/${drive.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
