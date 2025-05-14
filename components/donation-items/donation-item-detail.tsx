"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { DonationItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Mail, MapPin, Package, Phone, User, Check, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface DonationItemDetailProps {
  id: string
}

export function DonationItemDetail({ id }: DonationItemDetailProps) {
  const router = useRouter()
  const [item, setItem] = useState<DonationItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
          .from("donation_items")
          .select("*, users!inner(display_name, profile_image_url, is_verified)")
          .eq("id", id)
          .single()

        if (error) throw error
        if (!data) throw new Error("Item not found")

        setItem(data)
      } catch (err) {
        console.error("Error fetching donation item:", err)
        setError("Failed to load donation item details.")
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactForm.email || !contactForm.message) {
      toast({
        title: "Missing information",
        description: "Please provide your email and a message.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // In a real app, you would send this to your backend
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message sent!",
        description: "Your message has been sent to the donor.",
      })

      setContactOpen(false)
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (err) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const conditionMap = {
    new: { label: "New", description: "Brand new, unused item with original packaging or tags." },
    like_new: { label: "Like New", description: "Used minimally with no signs of wear." },
    good: { label: "Good", description: "Used with minor signs of wear but fully functional." },
    fair: { label: "Fair", description: "Used with noticeable wear but still functional." },
    poor: { label: "Poor", description: "Heavily used with significant wear or damage but still usable." },
  }

  if (loading) {
    return <div className="h-[600px] bg-muted rounded-lg animate-pulse" />
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold">Error Loading Item</h3>
        <p className="text-muted-foreground mt-2">{error || "Item not found"}</p>
        <Button variant="outline" onClick={() => router.push("/donation-items")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Items
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/donation-items">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-muted rounded-lg overflow-hidden mb-6">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0] || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-64 md:h-96 object-contain bg-white"
              />
            ) : (
              <div className="w-full h-64 md:h-96 flex items-center justify-center bg-muted">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{item.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="px-2 py-1 text-sm">{conditionMap[item.condition]?.label || item.condition}</Badge>
            <Badge variant="outline" className="px-2 py-1 text-sm">
              {formatCategory(item.category)}
            </Badge>
            {item.quantity > 1 && (
              <Badge variant="secondary" className="px-2 py-1 text-sm">
                Quantity: {item.quantity}
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {item.description || "No description provided."}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-2">Item Condition</h2>
              <p className="text-muted-foreground mb-2">
                {conditionMap[item.condition]?.description || "No condition details available."}
              </p>
            </div>

            {item.notes && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Additional Notes</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{item.notes}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    {item.users?.profile_image_url ? (
                      <img
                        src={item.users.profile_image_url || "/placeholder.svg"}
                        alt={item.users.display_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium flex items-center">
                      {item.users?.display_name || "Anonymous"}
                      {item.users?.is_verified && <Check className="ml-1 h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">Donor</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Posted</div>
                      <div>{format(new Date(item.created_at), "MMMM d, yyyy")}</div>
                    </div>
                  </div>

                  {item.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div>{item.location}</div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#1249BF] hover:bg-[#1249BF]/90">Contact Donor</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Contact About {item.title}</DialogTitle>
                      <DialogDescription>
                        Send a message to the donor to express your interest in this item.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">
                            Your Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Your Phone (optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">
                            Message <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            placeholder="Explain why you're interested in this item and how you plan to use it"
                            rows={4}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-[#1249BF] hover:bg-[#1249BF]/90" disabled={submitting}>
                          {submitting ? "Sending..." : "Send Message"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {(item.contact_email || item.contact_phone) && (
                  <div className="space-y-3 pt-3">
                    {item.contact_email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <a href={`mailto:${item.contact_email}`} className="text-sm hover:underline">
                          {item.contact_email}
                        </a>
                      </div>
                    )}
                    {item.contact_phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <a href={`tel:${item.contact_phone}`} className="text-sm hover:underline">
                          {item.contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {item.images && item.images.length > 1 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">More Images</h3>
              <div className="grid grid-cols-3 gap-2">
                {item.images.slice(1).map((image, index) => (
                  <div key={index} className="bg-muted rounded-md overflow-hidden h-24">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${item.title} - image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
