"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import { Building2, CheckCircle2, ArrowRight, MapPin, Users } from "lucide-react"
import type { User } from "@/lib/types"

export function FeaturedNGOs() {
  const { supabase } = useSupabase()
  const [featuredNGOs, setFeaturedNGOs] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedNGOs = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .in("role", ["ngo", "organization"])
          .eq("is_verified", true)
          .eq("profile_completed", true)
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) throw error
        setFeaturedNGOs(data as User[])
      } catch (error) {
        console.error("Error fetching featured NGOs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedNGOs()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded"></div>
                <div className="h-3 w-full bg-muted rounded"></div>
                <div className="h-3 w-2/3 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (featuredNGOs.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Organizations</h2>
          <p className="text-muted-foreground mt-2">Trusted partners making a difference in communities worldwide</p>
        </div>
        <Button variant="outline" asChild className="group">
          <Link href="/directory">
            View All Organizations
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredNGOs.map((ngo) => (
          <Card
            key={ngo.id}
            className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10"
          >
            <div className="h-40 bg-gradient-to-r from-primary/5 to-primary/20 relative">
              {ngo.image_url ? (
                <Image
                  src={ngo.image_url || "/placeholder.svg"}
                  alt={ngo.organization_name || ngo.display_name || ""}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-primary/30" />
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-lg">{ngo.organization_name || ngo.display_name}</h3>
                    {ngo.is_verified && <CheckCircle2 className="h-4 w-4 text-primary" title="Verified Organization" />}
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{ngo.role}</p>
                </div>
                <div className="bg-primary/10 rounded-full p-2">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </div>

              {ngo.mission_statement && <p className="text-sm line-clamp-2 mb-4">{ngo.mission_statement}</p>}

              <div className="flex flex-col gap-2 mb-4">
                {ngo.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{ngo.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 50) + 10} active campaigns</span>
                </div>
              </div>

              <Button variant="outline" asChild className="w-full group">
                <Link href={`/directory/${ngo.id}`}>
                  View Profile
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
