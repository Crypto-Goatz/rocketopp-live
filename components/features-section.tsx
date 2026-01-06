"use client"

import Image from "next/image"
import { CheckCircle } from "lucide-react"
import HoverGlowCard from "./hover-glow-card" // Assuming this is your glow card
import ShimmerHighlight from "./shimmer-highlight" // Assuming this is for text shimmer
import { usePersonalizationStore } from "@/lib/personalization-store" // To react to shimmer
import { useState, useEffect } from "react"

interface FeatureCardProps {
  title?: string
  description?: string
  imageUrl?: string
  imageQuery?: string // For alt text or potential display
  benefits?: string[]
  shimmerDelay?: number
}

function FeatureCard({ title, description, imageUrl, imageQuery, benefits, shimmerDelay }: FeatureCardProps) {
  const { industry, userName, companyName } = usePersonalizationStore() // To trigger shimmer on change
  const [shimmerActive, setShimmerActive] = useState(false)
  const [contentKey, setContentKey] = useState("initial-feature")

  useEffect(() => {
    const newKey = `${industry}-${userName}-${companyName}-${title}` // Make key specific to card content
    if (newKey !== contentKey) {
      setContentKey(newKey)
      setShimmerActive(true)
      const timer = setTimeout(() => setShimmerActive(false), 700) // Longer shimmer for cards
      return () => clearTimeout(timer)
    }
  }, [industry, userName, companyName, title, contentKey])

  return (
    <HoverGlowCard className="h-full">
      <div className="flex flex-col overflow-hidden rounded-lg bg-card shadow-lg h-full">
        {imageUrl && (
          <div className="relative h-56 w-full">
            <Image
              key={imageUrl} // Important for re-render on src change
              src={imageUrl || "/placeholder.svg?width=400&height=224&query=feature+image"}
              alt={imageQuery || title || "Feature image"}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              <ShimmerHighlight active={shimmerActive} delay={shimmerDelay}>
                {title || "Dynamic Feature"}
              </ShimmerHighlight>
            </h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              <ShimmerHighlight active={shimmerActive} delay={(shimmerDelay || 0) + 0.1}>
                {description || "Personalized content describing this powerful feature."}
              </ShimmerHighlight>
            </p>
            {benefits && benefits.length > 0 && (
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      <ShimmerHighlight active={shimmerActive} delay={(shimmerDelay || 0) + 0.2 + index * 0.05}>
                        {benefit}
                      </ShimmerHighlight>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </HoverGlowCard>
  )
}

// Updated FeaturesSection to accept dynamic image data as props
interface FeaturesSectionProps {
  feature1Title?: string
  feature1Description?: string
  feature1ImageUrl?: string
  feature1ImageQuery?: string
  feature2Title?: string
  feature2Description?: string
  feature2ImageUrl?: string
  feature2ImageQuery?: string
  feature3Title?: string
  feature3Description?: string
  feature3ImageUrl?: string
  feature3ImageQuery?: string
}

export default function FeaturesSection({
  feature1Title,
  feature1Description,
  feature1ImageUrl,
  feature1ImageQuery,
  feature2Title,
  feature2Description,
  feature2ImageUrl,
  feature2ImageQuery,
  feature3Title,
  feature3Description,
  feature3ImageUrl,
  feature3ImageQuery,
}: FeaturesSectionProps) {
  const benefitsRocketOpp = [
    "Bespoke Web Design & Development",
    "AI-Powered Digital Marketing",
    "Custom Application Development",
    "Intuitive Rocket Client CRM",
  ]

  const benefitsWebDesign = [
    "User-centric and responsive designs.",
    "SEO optimized for better visibility.",
    "Scalable architecture for future growth.",
  ]
  const benefitsAiMarketing = [
    "Data-driven campaign strategies.",
    "Personalized customer journeys.",
    "Maximized ROI through automation.",
  ]
  const benefitsRocketClient = [
    "Centralized client communication.",
    "Efficient sales pipeline management.",
    "Automated workflows and reporting.",
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-background" aria-labelledby="features-heading">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 id="features-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Solutions Tailored for Your Success by RocketOpp
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            RocketOpp provides cutting-edge digital tools and strategies designed to elevate your business, no matter
            your industry.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title={feature1Title}
            description={feature1Description}
            imageUrl={feature1ImageUrl}
            imageQuery={feature1ImageQuery}
            benefits={benefitsWebDesign}
            shimmerDelay={0}
          />
          <FeatureCard
            title={feature2Title}
            description={feature2Description}
            imageUrl={feature2ImageUrl}
            imageQuery={feature2ImageQuery}
            benefits={benefitsAiMarketing}
            shimmerDelay={0.1}
          />
          <FeatureCard
            title={feature3Title}
            description={feature3Description}
            imageUrl={feature3ImageUrl}
            imageQuery={feature3ImageQuery}
            benefits={benefitsRocketClient}
            shimmerDelay={0.2}
          />
        </div>
      </div>
    </section>
  )
}
