"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase/provider"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Edit, MapPin, Plus } from "lucide-react"
import { format } from "date-fns"

interface HelpRequest {
  id: string
  title: string
  description: string
  location: string
  is_active: boolean
  created_at: string
  requester_id: string
  request_type: string
  urgency_level: string
  status: string
  image_url?: string
}

export function DashboardHelpRequests() {
  const { supabase, user } = useSupabase()
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("help_requests")
          .select("*")
          .eq("requester_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setRequests(data as HelpRequest[])
      } catch (err: any) {
        console.error("Error fetching help requests:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [supabase, user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Help Requests</h1>
            <p className="text-muted-foreground">Manage your requests for assistance and support</p>
          </div>
          <Button asChild>
            <Link href="/help-requests/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Request
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
        <h3 className="text-lg font-medium">Error loading help requests</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Help Requests</h1>
          <p className="text-muted-foreground">Manage your requests for assistance and support</p>
        </div>
        <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
          <Link href="/help-requests/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">No help requests yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Create your first help request to ask for assistance from the community.
            </p>
            <Button asChild className="bg-[#1249BF] hover:bg-[#1249BF]/90">
              <Link href="/help-requests/new">Create Request</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            return (
              <Card key={request.id} className={!request.is_active ? "opacity-70" : undefined}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <Badge variant="secondary">{request.request_type?.replace("_", " ") || "Help Request"}</Badge>
                    {request.urgency_level && (
                      <Badge
                        variant={
                          request.urgency_level === "critical"
                            ? "destructive"
                            : request.urgency_level === "high"
                              ? "destructive"
                              : request.urgency_level === "medium"
                                ? "default"
                                : "outline"
                        }
                      >
                        {request.urgency_level}
                      </Badge>
                    )}
                    {!request.is_active && <Badge variant="outline">Inactive</Badge>}
                    {request.status && (
                      <Badge
                        variant={
                          request.status === "fulfilled"
                            ? "default"
                            : request.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {request.status.replace("_", " ")}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-1">{request.title}</CardTitle>
                  <CardDescription>Created on {format(new Date(request.created_at), "MMM d, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {request.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{request.location}</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/help-requests/${request.id}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/help-requests/edit/${request.id}`}>
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
