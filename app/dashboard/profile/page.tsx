"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase/provider"
import type { User } from "@/lib/types"
import { Loader2, UserIcon } from "lucide-react"

const profileFormSchema = z.object({
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  location: z.string().optional(),
  phone_number: z.string().optional(),
  blood_type: z.string().optional(),
})

const accountFormSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function ProfilePage() {
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      display_name: "",
      bio: "",
      location: "",
      phone_number: "",
      blood_type: "",
    },
  })

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      setLoading(true)

      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) throw error

        setUserProfile(data as User)
        profileForm.reset({
          display_name: data.display_name || "",
          bio: data.bio || "",
          location: data.location || "",
          phone_number: data.phone_number || "",
          blood_type: data.blood_type || "",
        })

        accountForm.reset({
          email: user.email || "",
          password: "",
          confirmPassword: "",
        })
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [supabase, user, toast, profileForm, accountForm])

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) return

    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          display_name: values.display_name,
          bio: values.bio,
          location: values.location,
          phone_number: values.phone_number,
          blood_type: values.blood_type,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function onAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    if (!user) return

    setIsUpdating(true)

    try {
      // Update email if changed
      if (values.email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: values.email })
        if (error) throw error
      }

      // Update password if provided
      if (values.password) {
        const { error } = await supabase.auth.updateUser({ password: values.password })
        if (error) throw error
      }

      toast({
        title: "Account updated",
        description: "Your account has been updated successfully.",
      })

      // Reset password fields
      accountForm.reset({
        ...accountForm.getValues(),
        password: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{userProfile?.display_name}</h2>
                <p className="text-sm text-muted-foreground capitalize">{userProfile?.role}</p>
              </div>
              <div className="w-full pt-4">
                <div className="space-y-2">
                  {userProfile?.location && (
                    <div className="text-sm">
                      <span className="font-medium">Location:</span> {userProfile.location}
                    </div>
                  )}
                  {userProfile?.blood_type && (
                    <div className="text-sm">
                      <span className="font-medium">Blood Type:</span> {userProfile.blood_type}
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-medium">Member Since:</span>{" "}
                    {new Date(userProfile?.created_at || "").toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile information and preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
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
                        control={profileForm.control}
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
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
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
                        control={profileForm.control}
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
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your account email and password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...accountForm}>
                    <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                      <FormField
                        control={accountForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormDescription>This is your account email address.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Leave blank to keep your current password.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
