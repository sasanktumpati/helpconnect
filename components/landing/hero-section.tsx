import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>

      {/* Colored Gradient Blob */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Connecting{" "}
              <span className="text-primary relative">
                communities
                <svg
                  className="absolute bottom-0 left-0 w-full h-2 text-primary/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0,5 C30,2 70,8 100,5 L100,10 L0,10 Z" fill="currentColor" />
                </svg>
              </span>{" "}
              to build a better tomorrow
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              A unified platform that connects NGOs, Charities, Individuals, MNCs, Corporations and small organizations to provide community aid,
              donations, and disaster relief when it matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/auth/register">
                <Button size="lg" className="group w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Campaigns
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-6">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-muted-foreground text-sm">Active Campaigns</p>
              </div>
              <div className="hidden sm:block h-12 border-l"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-primary">10k+</p>
                <p className="text-muted-foreground text-sm">People Helped</p>
              </div>
              <div className="hidden sm:block h-12 border-l"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl font-bold text-primary">200+</p>
                <p className="text-muted-foreground text-sm">Organizations</p>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://images.pexels.com/photos/8633370/pexels-photo-8633370.jpeg?auto=compress&cs=tinysrgb&w=1000&h=750&dpr=1"
              alt="Volunteers helping during disaster relief"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge variant="outline" className="bg-white/90 text-primary mb-2">
                Featured Campaign
              </Badge>
              <h3 className="text-white text-xl font-semibold mb-1">Shepherding Smiles</h3>
              <p className="text-white/90 text-sm">Providing livestock and relief to Raika/Rabari community in Rajasthan.</p>
              <Link href="/campaigns" className="mt-3 inline-block">
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
