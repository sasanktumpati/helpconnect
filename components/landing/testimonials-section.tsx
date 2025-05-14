import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "HelpConnect made it easy for our NGO to organize relief efforts after the flood. We were able to coordinate with local volunteers and distribute aid efficiently.",
      name: "Sarah Johnson",
      role: "NGO Director",
      avatar: "/testimonial-1.png",
      rating: 5,
    },
    {
      quote:
        "When my neighborhood was affected by wildfires, I used HelpConnect to find temporary housing and essential supplies. The community response was overwhelming.",
      name: "Michael Chen",
      role: "Community Member",
      avatar: "/testimonial-2.png",
      rating: 5,
    },
    {
      quote:
        "As a small organization, we've been able to make a bigger impact by connecting with donors and volunteers through this platform. The verification system builds trust.",
      name: "Priya Sharma",
      role: "Local Charity Founder",
      avatar: "/testimonial-3.png",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
      <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Stories of Impact</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Hear from people who have used HelpConnect to make a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white border border-primary/10 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="p-6 pb-0">
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="mb-6 italic text-lg">{testimonial.quote}</p>
                </div>

                <div className="border-t p-6 flex items-center">
                  <div className="mr-4 relative h-12 w-12">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 rounded-l-full blur-3xl"></div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Join thousands of people making a difference</h3>
              <p className="text-muted-foreground mb-6">
                Our community is growing every day. From individuals to large organizations, people are coming together
                to help those in need.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-3xl font-bold text-primary">94%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction rate</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-3xl font-bold text-primary">$2.5M</p>
                  <p className="text-sm text-muted-foreground">Funds raised</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-3xl font-bold text-primary">15k+</p>
                  <p className="text-sm text-muted-foreground">Active users</p>
                </div>
              </div>
            </div>

            <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl">
              <Image src="https://cdn.pixabay.com/photo/2022/01/17/17/27/india-6945344_960_720.jpg 1x, https://cdn.pixabay.com/photo/2022/01/17/17/27/india-6945344_1280.jpg" alt="Community impact" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
