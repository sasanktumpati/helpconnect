import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { CTASection } from "@/components/landing/cta-section"
import { FeaturedNGOs } from "@/components/landing/featured-ngos"
import { FeaturedDonationItems } from "@/components/landing/featured-donation-items"

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <div className="container py-20">
        <FeaturedNGOs />
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
