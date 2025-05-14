import { UserPlus, Search, HandHeart, BadgeCheck, ArrowRight, Check, Bell, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Custom components for each step
const CreateAccountComponent = () => (
  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl border border-primary/10 bg-white p-6">
    <div className="absolute top-4 right-4 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
      Step 1
    </div>

    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b border-muted">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">Create Your Account</h4>
          <p className="text-sm text-muted-foreground">Quick and easy setup</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">Personal profile</span>
        </div>
        <div className="flex items-center space-x-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">Organization details</span>
        </div>
        <div className="flex items-center space-x-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">Verification process</span>
        </div>
      </div>

      <Card className="p-4 bg-muted/50 border-dashed">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Individual Donor</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
            Verified
          </Badge>
        </div>
      </Card>
    </div>
  </div>
)

const FindCampaignsComponent = () => (
  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl border border-primary/10 bg-white p-6">
    <div className="absolute top-4 right-4 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
      Step 2
    </div>

    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b border-muted">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">Find or Create Campaigns</h4>
          <p className="text-sm text-muted-foreground">Discover or start initiatives</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 cursor-pointer hover:bg-muted/20 transition-colors">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
              Disaster Relief
            </Badge>
            <p className="text-xs font-medium">Flood Relief Fund</p>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full w-3/4"></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>$15,000</span>
              <span className="text-muted-foreground">$20,000</span>
            </div>
          </div>
        </Card>

        <Card className="p-3 cursor-pointer hover:bg-muted/20 transition-colors">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              Education
            </Badge>
            <p className="text-xs font-medium">School Supplies</p>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full w-1/2"></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>$5,000</span>
              <span className="text-muted-foreground">$10,000</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm">Search campaigns...</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
)

const ContributeComponent = () => (
  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl border border-primary/10 bg-white p-6">
    <div className="absolute top-4 right-4 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
      Step 3
    </div>

    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b border-muted">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <HandHeart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">Contribute or Request Help</h4>
          <p className="text-sm text-muted-foreground">Give or receive assistance</p>
        </div>
      </div>

      <div className="space-y-3">
        <Card
          className={cn(
            "p-3 border-l-4 border-l-primary relative overflow-hidden",
            "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-transparent before:opacity-30",
          )}
        >
          <div className="relative space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Donation
              </Badge>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <p className="text-sm font-medium">$100 to Flood Relief</p>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <HandHeart className="h-3 w-3" />
              <span>from John D.</span>
            </div>
          </div>
        </Card>

        <Card
          className={cn(
            "p-3 border-l-4 border-l-amber-500 relative overflow-hidden",
            "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-500/10 before:to-transparent before:opacity-30",
          )}
        >
          <div className="relative space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                Help Request
              </Badge>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <p className="text-sm font-medium">Medical Supplies Needed</p>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Bell className="h-3 w-3" />
              <span>from Rural Health Center</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1 h-9">
          <HandHeart className="h-4 w-4 mr-2" />
          Donate
        </Button>
        <Button variant="outline" size="sm" className="flex-1 h-9">
          <Bell className="h-4 w-4 mr-2" />
          Request
        </Button>
      </div>
    </div>
  </div>
)

const TrackImpactComponent = () => (
  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl border border-primary/10 bg-white p-6">
    <div className="absolute top-4 right-4 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
      Step 4
    </div>

    <div className="space-y-6">
      <div className="flex items-center space-x-4 pb-4 border-b border-muted">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <BadgeCheck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">Track Impact</h4>
          <p className="text-sm text-muted-foreground">See the difference you make</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total Donations</span>
            <span className="font-semibold text-primary">$25,750</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-[85%]"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">People Helped</span>
            <span className="font-semibold text-primary">1,250</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-[65%]"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Campaigns Supported</span>
            <span className="font-semibold text-primary">12</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-[40%]"></div>
          </div>
        </div>
      </div>

      <Card className="p-3 bg-green-50 border-green-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <BadgeCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Impact Certificate</p>
            <p className="text-xs text-green-600">Your contributions have helped 250 people</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
)

export function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="h-12 w-12 text-primary" />,
      title: "Create an Account",
      description: "Sign up as an individual, NGO, or small organization and set up your profile.",
      component: <CreateAccountComponent />,
      link: "/auth/register",
      buttonText: "Sign Up Now",
    },
    {
      icon: <Search className="h-12 w-12 text-primary" />,
      title: "Find or Create Campaigns",
      description: "Browse existing campaigns or create your own to address specific needs.",
      component: <FindCampaignsComponent />,
      link: "/campaigns",
      buttonText: "Browse Campaigns",
    },
    {
      icon: <HandHeart className="h-12 w-12 text-primary" />,
      title: "Contribute or Request Help",
      description: "Donate money, goods, time, or blood. Request help for yourself or others in need.",
      component: <ContributeComponent />,
      link: "/help-requests",
      buttonText: "Get Involved",
    },
    {
      icon: <BadgeCheck className="h-12 w-12 text-primary" />,
      title: "Track Impact",
      description: "Monitor the progress of campaigns and see the real-world impact of your contributions.",
      component: <TrackImpactComponent />,
      link: "/dashboard",
      buttonText: "View Dashboard",
    },
  ]

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
      <div className="absolute top-1/3 right-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Our platform makes it easy to give and receive help when it's needed most.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 h-[calc(100%-6rem)] w-1 bg-primary/20 hidden lg:block"></div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:rtl" : ""}`}
                >
                  <div className={`flex flex-col ${index % 2 === 1 ? "lg:items-end lg:text-right" : ""}`}>
                    <div className="relative z-10 bg-white p-4 rounded-full border-4 border-primary/20 mb-6 w-24 h-24 flex items-center justify-center shadow-md">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground text-lg max-w-md mb-6">{step.description}</p>
                    <Link href={step.link}>
                      <Button className="group">
                        {step.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>

                  {step.component}

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-[-4rem] w-6 h-6 rounded-full bg-primary/20 z-10"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
