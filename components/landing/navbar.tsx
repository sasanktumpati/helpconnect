"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase/provider"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { user } = useSupabase()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">HelpConnect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/campaigns" className="text-sm font-medium hover:text-primary">
            Campaigns
          </Link>
          <Link href="/donation-items" className="text-sm font-medium hover:text-primary">
            Donation Items
          </Link>
          <Link href="/help-requests" className="text-sm font-medium hover:text-primary">
            Help Requests
          </Link>
          <Link href="/community-drives" className="text-sm font-medium hover:text-primary">
            Community Drives
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About Us
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/campaigns"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              href="/donation-items"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Donation Items
            </Link>
            <Link
              href="/help-requests"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Help Requests
            </Link>
            <Link
              href="/community-drives"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Community Drives
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>

            <div className="pt-4 flex flex-col space-y-2">
              {user ? (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
