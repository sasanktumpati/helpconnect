import { Heart, Users, BarChart3, Shield, MapPin, Bell, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FeaturesSection() {
  const features = [
    {
      icon: <Heart className="h-10 w-10 text-white" />,
      title: "Unified Platform",
      description: "A single interface with role-based features for NGOs, individuals, and small organizations.",
      color: "from-primary to-primary/80",
      link: "/about",
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: "Community Drives",
      description:
        "Organize and participate in environmental, community building, health camps, and emergency response teams.",
      color: "from-primary to-primary/80",
      link: "/community-drives",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-white" />,
      title: "Campaign Management",
      description: "Create and manage monetary, goods, blood, volunteer, and disaster relief campaigns.",
      color: "from-primary to-primary/80",
      link: "/campaigns",
    },
    {
      icon: <Shield className="h-10 w-10 text-white" />,
      title: "Trust-Focused",
      description: "Verification badges, progress tracking, and transparent donation management.",
      color: "from-primary to-primary/80",
      link: "/about",
    },
    {
      icon: <MapPin className="h-10 w-10 text-white" />,
      title: "Location-Based",
      description: "Find and support campaigns and drives in your local area or specific disaster-affected regions.",
      color: "from-primary to-primary/80",
      link: "/campaigns",
    },
    {
      icon: <Bell className="h-10 w-10 text-white" />,
      title: "Smart Notifications",
      description: "Get alerts based on your preferences, blood type, location, and interests.",
      color: "from-primary to-primary/80",
      link: "/auth/register",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-muted/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
            Platform Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Features That Make a Difference</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Our platform is designed to make community aid and disaster relief more accessible, transparent, and
            effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link href={feature.link} key={index} className="block group">
              <div className="bg-white rounded-xl p-6 shadow-md border border-primary/10 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 h-full">
                <div
                  className={`mb-6 w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              Why Choose HelpConnect
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">
              Bridging the Gap Between Helpers and Those in Need
            </h2>
            <p className="text-muted-foreground mb-6">
              HelpConnect was built with a simple mission: to make it easier for people to help each other during times
              of crisis and beyond. Our platform removes barriers and creates connections that make a real difference.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Transparent Operations</h4>
                  <p className="text-sm text-muted-foreground">
                    Track exactly where your donations go and the impact they make.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Verified Organizations</h4>
                  <p className="text-sm text-muted-foreground">
                    All NGOs and organizations are verified to ensure legitimacy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Direct Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect directly with the people and communities you're helping.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/auth/register">
                <Button className="group">
                  Join Our Community
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/4456255/pexels-photo-4456255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="People collaborating on disaster relief"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Volunteers</p>
                  <p className="text-2xl font-bold text-primary">25,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
