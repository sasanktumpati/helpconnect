import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-primary/5 to-white"></div>
      <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl"></div>

          <div className="relative flex flex-col items-center text-center space-y-8">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
              Join Our Community
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              Ready to Make a{" "}
              <span className="text-primary relative">
                Difference?
                <svg
                  className="absolute bottom-0 left-0 w-full h-2 text-primary/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0,5 C30,2 70,8 100,5 L100,10 L0,10 Z" fill="currentColor" />
                </svg>
              </span>
            </h2>

            <p className="text-muted-foreground text-lg max-w-2xl">
              Join our community of helpers and those in need. Together, we can create a more resilient and supportive
              world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link href="/auth/register" className="w-full">
                <Button size="lg" className="w-full group">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/campaigns" className="w-full">
                <Button size="lg" variant="outline" className="w-full">
                  Browse Campaigns
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 w-full">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-primary">10k+</p>
                <p className="text-sm text-muted-foreground">People Helped</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-primary">200+</p>
                <p className="text-sm text-muted-foreground">Organizations</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
