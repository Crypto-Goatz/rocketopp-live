"use client"

import { Star, MapPin, Quote } from "lucide-react"
import { Card } from "@/components/ui/card"

const testimonials = [
  {
    name: "Mike & Sarah Johnson",
    location: "Murrysville, PA",
    rating: 5,
    text: "Our heating bills dropped by 40% after EcoSpray insulated our attic. The crew was professional, clean, and finished in one day. Highly recommend!",
    project: "Attic Insulation",
  },
  {
    name: "Tom Reynolds",
    location: "Pittsburgh, PA",
    rating: 5,
    text: "As a commercial property owner, I was skeptical about the investment. After seeing the energy savings in my first quarter, I had them do all three of my buildings.",
    project: "Commercial Buildings",
  },
  {
    name: "Jennifer Martinez",
    location: "Monroeville, PA",
    rating: 5,
    text: "We had terrible drafts in our 1920s home. EcoSpray sealed everything up and now our home is comfortable year-round. The difference is incredible.",
    project: "Whole Home Retrofit",
  },
  {
    name: "David Chen",
    location: "Export, PA",
    rating: 5,
    text: "New construction project came in under budget on HVAC thanks to the superior insulation. EcoSpray delivered on time and exactly as promised.",
    project: "New Construction",
  },
]

export default function EcosprayTestimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what Pittsburgh homeowners and
            business owners are saying about EcoSpray Solutions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="p-6 bg-zinc-900/50 border-zinc-800 hover:border-green-500/30 transition-all"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-green-500/30 mb-4" />

              {/* Testimonial Text */}
              <p className="text-zinc-300 mb-6 italic">&quot;{testimonial.text}&quot;</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="flex items-center gap-1 text-sm text-zinc-500">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
                <div className="text-right">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-xs text-green-400">{testimonial.project}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-zinc-400">
              <span className="text-white font-bold">4.9/5</span> from 200+ reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
