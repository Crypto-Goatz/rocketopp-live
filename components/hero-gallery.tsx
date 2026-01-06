"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const heroImages = [
  {
    src: "/hero-gallery-1.jpg",
    alt: "Photorealistic astronaut developing AI-powered CRM in space station",
  },
  {
    src: "/hero-gallery-2.jpg",
    alt: "Astronaut coding futuristic website with holographic interface",
  },
  {
    src: "/hero-gallery-3.jpg",
    alt: "Space mission control center with digital marketing dashboards",
  },
  {
    src: "/hero-gallery-4.jpg",
    alt: "Astronaut managing automated workflows in orbital workspace",
  },
  {
    src: "/hero-gallery-5.jpg",
    alt: "Rocket launching with business growth analytics visualization",
  },
]

export default function HeroGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative w-full h-full animate-ken-burns">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
