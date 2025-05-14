"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"

interface AuthPromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message?: string
  redirectUrl?: string
}

export function AuthPrompt({ open, onOpenChange, message, redirectUrl }: AuthPromptProps) {
  const { user } = useSupabase()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // If user is already authenticated, close the dialog
  if (user && open) {
    onOpenChange(false)
    if (redirectUrl) {
      router.push(redirectUrl)
    }
    return null
  }

  const handleLogin = () => {
    setIsRedirecting(true)
    const loginUrl = new URL("/auth/login", window.location.origin)
    if (redirectUrl) {
      loginUrl.searchParams.set("redirect", redirectUrl)
    }
    router.push(loginUrl.toString())
  }

  const handleSignUp = () => {
    setIsRedirecting(true)
    const signupUrl = new URL("/auth/register", window.location.origin)
    if (redirectUrl) {
      signupUrl.searchParams.set("redirect", redirectUrl)
    }
    router.push(signupUrl.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>{message || "You need to be signed in to access this feature."}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Join our community to connect with NGOs, participate in campaigns, and make a difference.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={handleLogin} disabled={isRedirecting}>
            Log In
          </Button>
          <Button className="flex-1" onClick={handleSignUp} disabled={isRedirecting}>
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
