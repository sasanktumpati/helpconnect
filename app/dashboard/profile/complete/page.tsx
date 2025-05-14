"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase/provider"
import { Loader2, Plus, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserRole } from "@/lib/types"

// Common fields for all user types
const baseSchema = z.object({
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  phone_number: z.string().optional(),
})

// Individual-specific fields
const individualSchema = baseSchema.extend({
  blood_type: z.string().optional(),
})

// NGO-specific fields
const ngoSchema = baseSchema.extend({
  organization_name: z.string().min(2, {
    message: "Organization name is required.",
  }),
  organization_type: z.string().min(2, {
    message: "Organization type is required.",
  }),
  year_established: z.coerce
    .number()
    .min(1800, {
      message: "Please enter a valid year.",
    })
    .max(new Date().getFullYear(), {
      message: `Year cannot be in the future.`,
    }),
  registration_number: z.string().min(2, {
    message: "Registration number is required.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  mission_statement: z.string().min(20, {
    message: "Mission statement must be at least 20 characters.",
  }),
  staff_count: z.coerce.number().min(0, {
    message: "Staff count must be a positive number.",
  }),
  volunteer_count: z.coerce.number().min(0, {
    message: "Volunteer count must be a positive number.",
  }),
  tax_exempt_status: z.boolean().default(false),
})

// Organization-specific fields
const organizationSchema = baseSchema.extend({
  organization_name: z.string().min(2, {
    message: "Organization name is required.",
  }),
  organization_type: z.string().min(2, {
    message: "Organization type is required.",
  }),
  year_established: z.coerce
    .number()
    .min(1800, {
      message: "Please enter a valid year.",
    })
    .max(new Date().getFullYear(), {
      message: `Year cannot be in the future.`,
    }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  mission_statement: z.string().min(20, {
    message: "Mission statement must be at least 20 characters.",
  }),
  staff_count: z.coerce.number().min(0, {
    message: "Staff count must be a positive number.",
  }),
})

const organizationTypes = [
  { value: "corporation", label: "Corporation" },
  { value: "government", label: "Government Agency" },
  { value: "educational", label: "Educational Institution" },
  { value: "healthcare", label: "Healthcare Provider" },
  { value: "religious", label: "Religious Organization" },
  { value: "other", label: "Other" },
]

const ngoTypes = [
  { value: "humanitarian", label: "Humanitarian" },
  { value: "educational", label: "Educational" },
  { value: "healthcare", label: "Healthcare" },
  { value: "environmental", label: "Environmental" },
  { value: "human_rights", label: "Human Rights" },
  { value: "animal_welfare", label: "Animal Welfare" },
  { value: "community", label: "Community Development" },
  { value: "other", label: "Other" },
]

export default function ProfileCompletionPage() {
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole>("individual")
  const [focusArea, setFocusArea] = useState("")
  const [areasOfFocusState, setAreasOfFocusState] = useState<string[]>([])
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  })
  const [activeTab, setActiveTab] = useState("basic")
  const tabsRef = useRef<HTMLDivElement>(null)

  const individualForm = useForm<z.infer<typeof individualSchema>>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      display_name: "",
      bio: "",
      location: "",
      phone_number: "",
      blood_type: "",
    },
  })

  const ngoForm = useForm<z.infer<typeof ngoSchema>>({
    resolver: zodResolver(ngoSchema),
    defaultValues: {
      display_name: "",
      bio: "",
      location: "",
      phone_number: "",
      organization_name: "",
      organization_type: "",
      year_established: undefined,
      registration_number: "",
      website: "",
      mission_statement: "",
      staff_count: 0,
      volunteer_count: 0,
      tax_exempt_status: false,
    },
  })

  const organizationForm = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      display_name: "",
      bio: "",
      location: "",
      phone_number: "",
      organization_name: "",
      organization_type: "",
      year_established: undefined,
      website: "",
      mission_statement: "",
      staff_count: 0,
    },
  })

  const getActiveForm = () => {
    switch (userRole) {
      case "individual":
        return individualForm
      case "ngo":
        return ngoForm
      case "organization":
        return organizationForm
      default:
        return individualForm
    }
  }

  const addAreaOfFocus = () => {
    if (!focusArea.trim()) return
    if (!areasOfFocusState.includes(focusArea.trim())) {
      setAreasOfFocusState([...areasOfFocusState, focusArea.trim()])
    }
    setFocusArea("")
  }

  const removeAreaOfFocus = (area: string) => {
    setAreasOfFocusState(areasOfFocusState.filter((a) => a !== area))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setSocialMedia({
      ...socialMedia,
      [platform]: value,
    })
  }

  const goToNextTab = () => {
    if (activeTab === "basic" && (userRole === "ngo" || userRole === "organization")) {
      getActiveForm()
        .trigger(["display_name", "location"])
        .then((isValid) => {
          if (isValid) {
            setActiveTab("organization")
            const organizationTab = tabsRef.current?.querySelector('[data-value="organization"]') as HTMLButtonElement
            if (organizationTab) {
              organizationTab.click()
            }
          } else {
            toast({
              title: "Validation Error",
              description: "Please fill in all required fields before proceeding.",
              variant: "destructive",
            })
          }
        })
    } else if (activeTab === "organization" && (userRole === "ngo" || userRole === "organization")) {
      const fieldsToValidate = ["organization_name", "organization_type", "year_established", "mission_statement"]

      if (userRole === "ngo") {
        fieldsToValidate.push("registration_number")
      }

      getActiveForm()
        .trigger(fieldsToValidate)
        .then((isValid) => {
          if (isValid) {
            if (areasOfFocusState.length === 0) {
              toast({
                title: "Missing Information",
                description: "Please add at least one area of focus.",
                variant: "destructive",
              })
              return
            }

            setActiveTab("additional")
            // Find and click the additional tab
            const additionalTab = tabsRef.current?.querySelector('[data-value="additional"]') as HTMLButtonElement
            if (additionalTab) {
              additionalTab.click()
            }
          } else {
            toast({
              title: "Validation Error",
              description: "Please fill in all required fields before proceeding.",
              variant: "destructive",
            })
          }
        })
    }
  }

  useEffect(() => {
    if (!user) return

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)

        const { data, error } = await supabase.from("users").select("*").eq("id", user.id)

        if (!data || data.length === 0) {
          const role = user.user_metadata?.role || "individual"
          setUserRole(role as UserRole)

          const { data: existingUserData, error: existingUserError } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle()

          if (existingUserData) {
            console.log("User with this email already exists, updating instead of creating")
            const { error: updateError } = await supabase
              .from("users")
              .update({
                id: user.id,
                role: role,
                display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
                profile_completed: false,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingUserData.id)

            if (updateError) {
              console.error("Error updating existing user profile:", updateError)
              toast({
                title: "Error",
                description: "Failed to update user profile. Please try again.",
                variant: "destructive",
              })
              return
            }
          } else {
            const { error: insertError } = await supabase.from("users").insert({
              id: user.id,
              email: user.email,
              role: role,
              display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
              profile_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              console.error("Error creating user profile:", insertError)
              toast({
                title: "Error",
                description: "Failed to create user profile. Please try again.",
                variant: "destructive",
              })
              return
            }
          }
          // Set default values from user metadata
          const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "User"

          individualForm.reset({
            display_name: displayName,
            bio: "",
            location: "",
            phone_number: "",
            blood_type: "",
          })

          ngoForm.reset({
            display_name: displayName,
            bio: "",
            location: "",
            phone_number: "",
            organization_name: "",
            organization_type: "",
            year_established: undefined,
            registration_number: "",
            website: "",
            mission_statement: "",
            staff_count: 0,
            volunteer_count: 0,
            tax_exempt_status: false,
          })

          organizationForm.reset({
            display_name: displayName,
            bio: "",
            location: "",
            phone_number: "",
            organization_name: "",
            organization_type: "",
            year_established: undefined,
            website: "",
            mission_statement: "",
            staff_count: 0,
          })
        } else if (data && data.length > 0) {
          const userProfile = data[0]
          setUserRole(userProfile.role as UserRole)

          if (userProfile.profile_completed) {
            router.push("/dashboard")
            return
          }

          const commonFields = {
            display_name: userProfile.display_name || "",
            bio: userProfile.bio || "",
            location: userProfile.location || "",
            phone_number: userProfile.phone_number || "",
          }

          individualForm.reset({
            ...commonFields,
            blood_type: userProfile.blood_type || "",
          })

          ngoForm.reset({
            ...commonFields,
            organization_name: userProfile.organization_name || "",
            organization_type: userProfile.organization_type || "",
            year_established: userProfile.year_established || undefined,
            registration_number: userProfile.registration_number || "",
            website: userProfile.website || "",
            mission_statement: userProfile.mission_statement || "",
            staff_count: userProfile.staff_count || 0,
            volunteer_count: userProfile.volunteer_count || 0,
            tax_exempt_status: userProfile.tax_exempt_status || false,
          })

          organizationForm.reset({
            ...commonFields,
            organization_name: userProfile.organization_name || "",
            organization_type: userProfile.organization_type || "",
            year_established: userProfile.year_established || undefined,
            website: userProfile.website || "",
            mission_statement: userProfile.mission_statement || "",
            staff_count: userProfile.staff_count || 0,
          })

          // Set areas of focus and social media
          if (userProfile.areas_of_focus) {
            setAreasOfFocusState(userProfile.areas_of_focus)
          }

          if (userProfile.social_media) {
            setSocialMedia({
              facebook: userProfile.social_media.facebook || "",
              twitter: userProfile.social_media.twitter || "",
              instagram: userProfile.social_media.instagram || "",
              linkedin: userProfile.social_media.linkedin || "",
            })
          }
        }
      } catch (error) {
        console.error("Error in profile setup:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, supabase, individualForm, ngoForm, organizationForm, router, toast])

  const onSubmitIndividual = async (values: z.infer<typeof individualSchema>) => {
    if (!user) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          ...values,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile completed",
        description: "Your profile has been completed successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitNGO = async (values: z.infer<typeof ngoSchema>) => {
    if (!user) return

    if (areasOfFocusState.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one area of focus.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const filteredSocialMedia: Record<string, string> = {}
      Object.entries(socialMedia).forEach(([key, value]) => {
        if (value.trim()) {
          filteredSocialMedia[key] = value
        }
      })

      const { error } = await supabase
        .from("users")
        .update({
          ...values,
          social_media: filteredSocialMedia,
          areas_of_focus: areasOfFocusState,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile completed",
        description: "Your NGO profile has been completed successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitOrganization = async (values: z.infer<typeof organizationSchema>) => {
    if (!user) return

    if (areasOfFocusState.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one area of focus.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const filteredSocialMedia: Record<string, string> = {}
      Object.entries(socialMedia).forEach(([key, value]) => {
        if (value.trim()) {
          filteredSocialMedia[key] = value
        }
      })

      const { error } = await supabase
        .from("users")
        .update({
          ...values,
          social_media: filteredSocialMedia,
          areas_of_focus: areasOfFocusState,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile completed",
        description: "Your organization profile has been completed successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSubmitHandler = () => {
    switch (userRole) {
      case "individual":
        return onSubmitIndividual
      case "ngo":
        return onSubmitNGO
      case "organization":
        return onSubmitOrganization
      default:
        return onSubmitIndividual
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-screen-md py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-screen-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {userRole === "individual" && "Please complete your profile information to continue using the platform."}
            {userRole === "ngo" &&
              "Please provide detailed information about your NGO to establish trust with potential donors and volunteers."}
            {userRole === "organization" &&
              "Please provide information about your organization to help others understand your mission and goals."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full" ref={tabsRef} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              {(userRole === "ngo" || userRole === "organization") && (
                <TabsTrigger value="organization">Organization</TabsTrigger>
              )}
              {(userRole === "ngo" || userRole === "organization") && (
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="basic">
              {userRole === "individual" && (
                <Form {...individualForm}>
                  <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-6">
                    <FormField
                      control={individualForm.control}
                      name="display_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>This is your public display name.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little about yourself"
                              className="resize-none"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>Brief description for your profile.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={individualForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={individualForm.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={individualForm.control}
                      name="blood_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ""}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NOT_SPECIFIED">Not specified</SelectItem>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Used for blood donation campaigns and alerts.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Complete Profile"
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {(userRole === "ngo" || userRole === "organization") && (
                <Form {...getActiveForm()}>
                  <div className="space-y-6">
                    <FormField
                      control={getActiveForm().control}
                      name="display_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Name of the primary contact person.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={getActiveForm().control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief information about the contact person"
                              className="resize-none"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>Information about the contact person.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={getActiveForm().control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={getActiveForm().control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="button" onClick={goToNextTab} className="w-full">
                      Next: Organization Details
                    </Button>
                  </div>
                </Form>
              )}
            </TabsContent>

            {(userRole === "ngo" || userRole === "organization") && (
              <TabsContent value="organization">
                <Form {...getActiveForm()}>
                  <div className="space-y-6">
                    <FormField
                      control={getActiveForm().control}
                      name="organization_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The official name of your {userRole === "ngo" ? "NGO" : "organization"}.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={getActiveForm().control}
                      name="organization_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Type</FormLabel>
                          {userRole === "organization" ? (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {organizationTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select NGO type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ngoTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={getActiveForm().control}
                        name="year_established"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year Established</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {userRole === "ngo" && (
                        <FormField
                          control={ngoForm.control}
                          name="registration_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registration Number</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value || ""} />
                              </FormControl>
                              <FormDescription>Official registration number if available.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <FormField
                      control={getActiveForm().control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://www.example.org"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={getActiveForm().control}
                      name="mission_statement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mission Statement</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your organization's mission and goals"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem className="space-y-2">
                      <FormLabel>Areas of Focus</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Add an area of focus"
                            value={focusArea}
                            onChange={(e) => setFocusArea(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addAreaOfFocus()
                              }
                            }}
                          />
                        </FormControl>
                        <Button type="button" onClick={addAreaOfFocus} size="sm">
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add</span>
                        </Button>
                      </div>
                      <FormDescription>
                        Add the main areas your {userRole === "ngo" ? "NGO" : "organization"} focuses on.
                      </FormDescription>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {areasOfFocusState.map((area, index) => (
                          <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
                            {area}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removeAreaOfFocus(area)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      {areasOfFocusState.length === 0 && (
                        <p className="text-sm text-muted-foreground">Please add at least one area of focus.</p>
                      )}
                    </FormItem>

                    <Button type="button" onClick={goToNextTab} className="w-full">
                      Next: Additional Information
                    </Button>
                  </div>
                </Form>
              </TabsContent>
            )}

            {/* Additional Info Tab - For NGO and Organization user types */}
            {(userRole === "ngo" || userRole === "organization") && (
              <TabsContent value="additional">
                <Form {...getActiveForm()}>
                  <form onSubmit={getActiveForm().handleSubmit(getSubmitHandler())} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={getActiveForm().control}
                        name="staff_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Staff Count</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {userRole === "ngo" && (
                        <FormField
                          control={ngoForm.control}
                          name="volunteer_count"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Volunteer Count</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {userRole === "ngo" && (
                      <FormField
                        control={ngoForm.control}
                        name="tax_exempt_status"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Tax Exempt Status</FormLabel>
                              <FormDescription>Check if your organization has tax-exempt status.</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="space-y-4">
                      <FormLabel>Social Media (Optional)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel className="text-sm">Facebook</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://facebook.com/yourpage"
                              value={socialMedia.facebook}
                              onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                            />
                          </FormControl>
                        </FormItem>

                        <FormItem>
                          <FormLabel className="text-sm">Twitter</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://twitter.com/yourhandle"
                              value={socialMedia.twitter}
                              onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                            />
                          </FormControl>
                        </FormItem>

                        <FormItem>
                          <FormLabel className="text-sm">Instagram</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://instagram.com/yourprofile"
                              value={socialMedia.instagram}
                              onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                            />
                          </FormControl>
                        </FormItem>

                        <FormItem>
                          <FormLabel className="text-sm">LinkedIn</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/company/yourorg"
                              value={socialMedia.linkedin}
                              onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        `Complete ${userRole === "ngo" ? "NGO" : "Organization"} Profile`
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
