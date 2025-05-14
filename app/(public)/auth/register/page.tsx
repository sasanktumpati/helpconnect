"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase/provider"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/types"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(100),
  displayName: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .max(50),
  role: z.enum(["individual", "ngo", "organization"], {
    required_error: "Please select a role.",
  }),
})

export default function RegisterPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      role: "individual",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", values.email)
        .maybeSingle()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            display_name: values.displayName,
            role: values.role,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        if (existingUser) {
          
          const { error: updateError } = await supabase
            .from("users")
            .update({
              id: data.user.id,
              display_name: values.displayName,
              role: values.role as UserRole,
              profile_completed: false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingUser.id)

          if (updateError) throw updateError
        } else {
          
          const { error: profileError } = await supabase.from("users").insert({
            id: data.user.id,
            email: values.email,
            display_name: values.displayName,
            role: values.role as UserRole,
            profile_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (profileError) throw profileError
        }
      }

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      })

      const redirectTo = searchParams.get("redirect") || "/dashboard"
      router.push(redirectTo)
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to start using HelpConnect.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I am registering as</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="individual" />
                          </FormControl>
                          <FormLabel className="font-normal">Individual</FormLabel>
                          <FormDescription className="ml-auto text-xs">Personal account</FormDescription>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="ngo" />
                          </FormControl>
                          <FormLabel className="font-normal">NGO</FormLabel>
                          <FormDescription className="ml-auto text-xs">Non-profit organization</FormDescription>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="organization" />
                          </FormControl>
                          <FormLabel className="font-normal">Organization</FormLabel>
                          <FormDescription className="ml-auto text-xs">Company or institution</FormDescription>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
