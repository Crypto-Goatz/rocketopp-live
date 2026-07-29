"use client"

import { motion } from "framer-motion"
import { Star, Quote, Award, Clock, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"


const portfolioItems = [
  { id: 1, title: "E-Commerce Platform", category: "Website Design" },
  { id: 2, title: "SaaS Dashboard", category: "App Development" },
  { id: 3, title: "Healthcare Portal", category: "Website Design" },
  { id: 4, title: "Real Estate Platform", category: "Website Design" },
  { id: 5, title: "Financial Services", category: "Website Design" },
  { id: 6, title: "Restaurant Chain", category: "Website Design" },
]

export default function ExperiencePageClient() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(portfolioItems.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(portfolioItems.length / 3)) % Math.ceil(portfolioItems.length / 3))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">25+ Years of Excellence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Trusted by Businesses That Demand Results
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Since 1999, we've been building for the web — websites, automation, and the AI systems
              behind them. Design, development and automation under one roof.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Projects Delivered" },
              { value: "25+", label: "Years Experience" },
              { value: "98%", label: "Client Retention" },
              { value: "$2.1B+", label: "Client Revenue Generated" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Awards Logo Scroller */}
      <section className="py-16 bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Industry Recognition</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Awards & Certifications</h2>
          </motion.div>

          {/* Placeholder for award logos - ready for your images */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll gap-12 py-4">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-32 h-16 bg-muted/30 rounded-lg flex items-center justify-center border border-border/30"
                >
                  <span className="text-xs text-muted-foreground">Award {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Upload your award images to populate this section
          </p>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Website Design Portfolio</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of our recent work. Each project represents a unique challenge solved with innovative
              solutions.
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-video bg-muted/30 rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  {/* Placeholder for screenshots */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Screenshot {item.id}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-xs text-primary font-medium mb-1">{item.category}</div>
                    <div className="font-semibold text-foreground">{item.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation arrows for future carousel expansion */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 bg-background/80 border border-border rounded-full hover:bg-primary/10 transition-colors hidden md:block"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 bg-background/80 border border-border rounded-full hover:bg-primary/10 transition-colors hidden md:block"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Upload your website screenshots to populate this gallery
          </p>
        </div>
      </section>

      {/* 25+ Years Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <span className="text-3xl font-bold text-primary">25+</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">A Quarter Century of Digital Innovation</h2>
              <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Since 1999, RocketOpp has been at the forefront of every major digital transformation. We built
                  websites before Google existed. We embraced mobile when smartphones were science fiction. We
                  integrated AI before it became a buzzword.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Through dot-com booms and busts, through economic recessions and global pandemics, one thing has
                  remained constant: our commitment to delivering exceptional results for our clients. We've weathered
                  every storm by staying ahead of the curve and never compromising on quality.
                </p>
                <p className="text-lg leading-relaxed mb-8">
                  Today, we're taking 25 years of enterprise-level expertise and making it accessible to businesses of
                  all sizes. The same technology that powers Fortune 500 companies is now available to your business, at
                  a fraction of the traditional cost. This isn't just leveling the playing field—it's disrupting
                  industries.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ai-assessment-start">
                  <Button size="lg" className="text-lg px-8">
                    Start Your Transformation
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join Our Success Stories?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Let's discuss how RocketOpp can transform your business with proven strategies and cutting-edge technology.
          </p>
          <Link href="/ai-assessment-start">
            <Button size="lg" className="text-lg px-10">
              Get Your Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
