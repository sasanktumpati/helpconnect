import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Building, Clock, Heart, type LucideIcon, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About Us | HelpConnect",
  description: "Learn about HelpConnect's mission to connect communities for disaster relief and aid.",
}

interface ValueCardProps {
  icon: LucideIcon
  title: string
  description: string
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1249BF]/10">
          <Icon className="h-6 w-6 text-[#1249BF]" />
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-20">
      <section className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            About <span className="text-[#1249BF]">HelpConnect</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            At HelpConnect, we believe that giving should be simple, direct, and impactful. We're building a one-stop
            platform that connects NGOs with both donors and those in need, making the donation process seamless for
            everyone involved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/directory">Find Organizations</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/campaigns">Explore Campaigns</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl">
            <Image
              src="https://images.pexels.com/photos/15957992/pexels-photo-15957992/free-photo-of-piaggo-ape-three-wheeler.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="HelpConnect volunteers"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-[#1249BF]/5 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg mb-4">
            To empower NGOs, individuals, schools, colleges, and corporations to donate effectively and help bridge the
            gap between generosity and need.
          </p>
          <h3 className="text-xl font-bold mt-6 mb-3">What We Do</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold">For Donors:</h4>
              <p>
                Whether you're an MNC, an individual, or an organization conducting a donation drive, our platform
                allows you to log in and easily post what you wish to donate—be it clothes, electronics, furniture,
                food, or even blood.
              </p>
            </div>
            <div>
              <h4 className="font-bold">For NGOs:</h4>
              <p>
                NGOs can manage incoming donations, post available items, and connect directly with beneficiaries who
                need them most.
              </p>
            </div>
            <div>
              <h4 className="font-bold">For Beneficiaries (Consumers):</h4>
              <p>
                Small-scale government schools, hospitals, orphanages, animal shelters, and old age homes can search for
                the items they need. Our platform automatically connects them to the NGO offering those exact items and
                provides a direct point of contact.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#1249BF]/5 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-lg mb-4">
            We envision a world where donations and support flow effortlessly from those who have more to those who need
            it most.
          </p>
          <p className="text-lg mb-4">
            A world where every NGO, school, orphanage, or shelter can access resources without bureaucracy, and where
            any individual or organization can make a real impact with just a few clicks.
          </p>
          <p className="text-lg mb-4">We're building a future where:</p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Resources are never wasted.</li>
            <li>Support is fast, transparent, and reliable.</li>
            <li>Communities come together to uplift one another.</li>
            <li>Technology enables compassion to reach every corner of society.</li>
          </ul>
          <p className="text-lg mt-4">
            We dream of a connected ecosystem where kindness is organized, and help is always within reach.
          </p>
        </div>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These principles shape everything we do at HelpConnect, from building intuitive tech to nurturing meaningful
            human connections across the donation ecosystem.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard
            icon={Heart}
            title="Trust & Transparency"
            description="We believe trust is the backbone of impact. From item verification to donor tracking, we ensure every step—whether you're giving or receiving—is authentic, traceable, and transparent."
          />
          <ValueCard
            icon={Users}
            title="Inclusivity"
            description="Whether you're a large corporation, a school organizing a drive, or an individual with just one item to give—our platform is built for everyone. No contribution is too small, and every need matters."
          />
          <ValueCard
            icon={Building}
            title="Community-Centered"
            description="We enable direct, local-level connections. A teacher in a rural school can now find a fridge, and an orphanage can get computers with just a few clicks. We prioritize grassroots action and community voices."
          />
          <ValueCard
            icon={Clock}
            title="Responsiveness"
            description="We know that time is crucial—especially in emergencies. Our system ensures that food, blood, or essential supplies reach those in need without delay, using a network of active NGOs ready to respond."
          />
        </div>
      </section>

      <section className="bg-[#1249BF]/5 p-8 md:p-12 rounded-xl">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <div className="space-y-6">
          <p className="text-lg">
            As students of BITS Pilani, we were introduced to the real-world challenges of social impact during a
            compulsory internship. One of our team members was placed with an NGO in a remote village in Andhra Pradesh
            — an experience that would spark something much bigger.
          </p>
          <p className="text-lg">
            While working there, we noticed a significant gap in the ecosystem of giving. The supply and demand chains
            of donations were disorganized, and most NGOs operated in silos without structured systems to manage
            donations or connect with people who needed help the most.
          </p>
          <p className="text-lg">
            Large corporations, colleges, and schools often chose to donate to well-known NGOs with an established
            presence. As a result, smaller, local NGOs remained overlooked, despite working tirelessly at the grassroots
            level.
          </p>
          <p className="text-lg">
            On the other side, many people in rural and semi-urban areas didn't even know NGOs could help them. Take
            this real example: A caretaker at a small old-age home needed mattresses but had no way of reaching any NGO.
            He lacked contacts, access, and time.
          </p>
          <p className="text-lg font-medium text-[#1249BF]">That's where our idea was born.</p>
          <p className="text-lg">We envisioned a simple, universal platform where:</p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Anyone can post a donation—be it a corporation or an individual.</li>
            <li>
              Any orphanage, school, or small hospital can search for and connect with an NGO offering exactly what they
              need.
            </li>
            <li>Everyone involved can track, verify, and mobilize support quickly and transparently.</li>
          </ul>
          <p className="text-lg">
            From a single internship experience, our journey evolved into building a platform that brings structure,
            speed, and inclusivity to the act of giving.
          </p>
          <p className="text-lg font-medium">Because helping should never be complicated.</p>
        </div>
      </section>

      <section className="bg-[#1249BF]/5 p-8 md:p-12 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Our Global Impact</h2>
            <p className="text-lg mb-4">
              Since our founding, HelpConnect has facilitated aid and support in over 50 countries, connecting thousands
              of organizations with millions of individuals in need.
            </p>
            <p className="text-lg mb-6">
              Through our platform, we've helped communities recover from natural disasters, supported ongoing
              humanitarian efforts, and empowered local initiatives that make a difference.
            </p>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1249BF]">500+</p>
                <p className="text-sm text-muted-foreground">NGOs</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1249BF]">1.2M+</p>
                <p className="text-sm text-muted-foreground">Users</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1249BF]">$15M+</p>
                <p className="text-sm text-muted-foreground">Donations</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
              <Image
                src="/world-map-connections.png"
                alt="Global impact map"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Whether you're an individual looking to help, an NGO seeking to expand your reach, or a small organization
          wanting to make a bigger impact, HelpConnect provides the tools and connections you need to make a difference.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="px-8" asChild>
            <Link href="/auth/register">Create Account</Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8" asChild>
            <Link href="/campaigns">Browse Campaigns</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
