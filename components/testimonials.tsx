import type React from "react"
import type { Testimonial } from "@/types"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface TestimonialsProps {
  testimonials?: Testimonial[]
  className?: string
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    title: "CEO, TechStart Inc",
    text: "RocketOpp transformed our digital presence with their AI-powered website. Our engagement has increased by 300%.",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Michael Chen",
    title: "Marketing Director, GrowthCo",
    text: "The team at RocketOpp delivered beyond our expectations. Their AI integration has revolutionized how we interact with customers.",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Emily Rodriguez",
    title: "Founder, InnovateLab",
    text: "Working with RocketOpp was seamless. They understood our vision and created a stunning, high-performance website that perfectly captures our brand.",
    image: "/placeholder.svg?height=40&width=40",
  },
]

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = defaultTestimonials, className }) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Clients Say</h2>
        <p className="mt-4 text-muted-foreground">
          Don't just take our word for it - hear from businesses we've helped transform
        </p>
      </div>
      <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.name + index}>
            <CardContent className="flex flex-col gap-4 p-6">
              <p className="text-sm italic text-muted-foreground">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
