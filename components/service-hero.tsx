"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { ReactNode } from "react"

interface FloatingCard {
  value: string
  label: string
  color: string // tailwind color class like "text-green-500"
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "mid-left" | "mid-right"
}

type VisualVariant = "orbits" | "hexagon" | "cube" | "wave" | "nodes" | "pulse"

interface ServiceHeroProps {
  icon: ReactNode
  title: string
  subtitle: string
  description: string
  gradient: string
  stats: { label: string; value: string }[]
  floatingCards?: FloatingCard[]
  visualVariant?: VisualVariant
  ctaText?: string
  ctaHref?: string
}

// Position configurations for floating cards
const positionStyles: Record<FloatingCard["position"], string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-8 right-8",
  "bottom-left": "bottom-8 left-8",
  "bottom-right": "bottom-4 right-4",
  "mid-left": "top-1/2 -left-4 -translate-y-1/2",
  "mid-right": "top-1/2 -right-4 -translate-y-1/2",
}

// Default floating cards if none provided
const defaultFloatingCards: FloatingCard[] = [
  { value: "+127%", label: "Growth", color: "text-green-500", position: "top-right" },
  { value: "24/7", label: "Support", color: "text-primary", position: "bottom-left" },
  { value: "99.9%", label: "Uptime", color: "text-blue-500", position: "mid-right" },
]

export function ServiceHero({
  icon,
  title,
  subtitle,
  description,
  gradient,
  stats,
  floatingCards = defaultFloatingCards,
  visualVariant = "orbits",
  ctaText = "Get Started",
  ctaHref = "/contact"
}: ServiceHeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center py-20 md:py-28 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                              linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Gradient Orbs */}
        <div className={`absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-20 animate-pulse`} />
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-15 animate-pulse`} style={{ animationDelay: '1s' }} />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${gradient} opacity-40`}
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm">
              {icon}
              <span className="font-medium">{subtitle}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {title}
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              {description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="group">
                <Link href={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/marketplace">
                  View Products
                </Link>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-6 pt-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    <strong>{stat.value}</strong> {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Branded Visual */}
          <div className="relative hidden lg:block">
            <div className={`relative w-full aspect-square max-w-lg mx-auto`}>

              {/* Visual Variant Rendering */}
              {visualVariant === "orbits" && (
                <>
                  {/* Main Circle */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} opacity-10`} />
                  {/* Orbiting Elements */}
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-current opacity-10 animate-spin" style={{ animationDuration: '30s' }} />
                  <div className="absolute inset-12 rounded-full border-2 border-dashed border-current opacity-10 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-20 rounded-full border-2 border-dashed border-current opacity-10 animate-spin" style={{ animationDuration: '15s' }} />
                </>
              )}

              {visualVariant === "hexagon" && (
                <>
                  {/* Hexagon Shape */}
                  <div className="absolute inset-8">
                    <svg viewBox="0 0 100 100" className={`w-full h-full opacity-10`}>
                      <polygon
                        points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-16">
                    <svg viewBox="0 0 100 100" className={`w-full h-full opacity-15`} style={{ animation: 'spin 25s linear infinite reverse' }}>
                      <polygon
                        points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="10 5"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-24">
                    <svg viewBox="0 0 100 100" className={`w-full h-full opacity-20`} style={{ animation: 'spin 20s linear infinite' }}>
                      <polygon
                        points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </>
              )}

              {visualVariant === "cube" && (
                <>
                  {/* 3D Cube Effect */}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '500px' }}>
                    <div
                      className={`w-48 h-48 border-2 border-current opacity-20`}
                      style={{
                        transform: 'rotateX(15deg) rotateY(-15deg)',
                        animation: 'cubeRotate 15s ease-in-out infinite'
                      }}
                    />
                    <div
                      className={`absolute w-40 h-40 border-2 border-dashed border-current opacity-15`}
                      style={{
                        transform: 'rotateX(-15deg) rotateY(15deg)',
                        animation: 'cubeRotate 20s ease-in-out infinite reverse'
                      }}
                    />
                    <div
                      className={`absolute w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-lg`}
                      style={{
                        animation: 'pulse 3s ease-in-out infinite'
                      }}
                    />
                  </div>
                </>
              )}

              {visualVariant === "wave" && (
                <>
                  {/* Wave Pattern */}
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-full h-1 bg-gradient-to-r ${gradient}`}
                        style={{
                          top: `${20 + i * 15}%`,
                          animation: `wave ${3 + i * 0.5}s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                          transform: 'scaleX(1.5)',
                          borderRadius: '50%',
                          height: '3px'
                        }}
                      />
                    ))}
                  </div>
                  {/* Concentric circles */}
                  <div className="absolute inset-8 rounded-full border border-current opacity-10" style={{ animation: 'ripple 4s ease-out infinite' }} />
                  <div className="absolute inset-16 rounded-full border border-current opacity-10" style={{ animation: 'ripple 4s ease-out infinite', animationDelay: '1s' }} />
                  <div className="absolute inset-24 rounded-full border border-current opacity-10" style={{ animation: 'ripple 4s ease-out infinite', animationDelay: '2s' }} />
                </>
              )}

              {visualVariant === "nodes" && (
                <>
                  {/* Connected Nodes */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                    {/* Connection Lines */}
                    <line x1="200" y1="80" x2="320" y2="160" stroke="currentColor" strokeWidth="1" className="opacity-10" />
                    <line x1="200" y1="80" x2="80" y2="160" stroke="currentColor" strokeWidth="1" className="opacity-10" />
                    <line x1="320" y1="160" x2="320" y2="280" stroke="currentColor" strokeWidth="1" className="opacity-10" />
                    <line x1="80" y1="160" x2="80" y2="280" stroke="currentColor" strokeWidth="1" className="opacity-10" />
                    <line x1="320" y1="280" x2="200" y2="340" stroke="currentColor" strokeWidth="1" className="opacity-10" />
                    <line x1="80" y1="280" x2="200" y2="340" stroke="currentColor" strokeWidth="1" className="opacity-10" />
                    <line x1="200" y1="200" x2="200" y2="80" stroke="currentColor" strokeWidth="1" className="opacity-10" strokeDasharray="5 5" />
                    <line x1="200" y1="200" x2="320" y2="160" stroke="currentColor" strokeWidth="1" className="opacity-10" strokeDasharray="5 5" />
                    <line x1="200" y1="200" x2="80" y2="160" stroke="currentColor" strokeWidth="1" className="opacity-10" strokeDasharray="5 5" />
                    <line x1="200" y1="200" x2="320" y2="280" stroke="currentColor" strokeWidth="1" className="opacity-10" strokeDasharray="5 5" />
                    <line x1="200" y1="200" x2="80" y2="280" stroke="currentColor" strokeWidth="1" className="opacity-10" strokeDasharray="5 5" />
                    <line x1="200" y1="200" x2="200" y2="340" stroke="currentColor" strokeWidth="1" className="opacity-10" strokeDasharray="5 5" />

                    {/* Nodes */}
                    <circle cx="200" cy="80" r="8" className={`fill-current opacity-30`} style={{ animation: 'nodePulse 2s ease-in-out infinite' }} />
                    <circle cx="320" cy="160" r="8" className={`fill-current opacity-30`} style={{ animation: 'nodePulse 2s ease-in-out infinite', animationDelay: '0.3s' }} />
                    <circle cx="80" cy="160" r="8" className={`fill-current opacity-30`} style={{ animation: 'nodePulse 2s ease-in-out infinite', animationDelay: '0.6s' }} />
                    <circle cx="320" cy="280" r="8" className={`fill-current opacity-30`} style={{ animation: 'nodePulse 2s ease-in-out infinite', animationDelay: '0.9s' }} />
                    <circle cx="80" cy="280" r="8" className={`fill-current opacity-30`} style={{ animation: 'nodePulse 2s ease-in-out infinite', animationDelay: '1.2s' }} />
                    <circle cx="200" cy="340" r="8" className={`fill-current opacity-30`} style={{ animation: 'nodePulse 2s ease-in-out infinite', animationDelay: '1.5s' }} />
                  </svg>
                </>
              )}

              {visualVariant === "pulse" && (
                <>
                  {/* Pulsing Rings */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} opacity-5`} />
                  <div className="absolute inset-8 rounded-full border-2 border-current opacity-10" style={{ animation: 'pulseRing 3s ease-out infinite' }} />
                  <div className="absolute inset-8 rounded-full border-2 border-current opacity-10" style={{ animation: 'pulseRing 3s ease-out infinite', animationDelay: '1s' }} />
                  <div className="absolute inset-8 rounded-full border-2 border-current opacity-10" style={{ animation: 'pulseRing 3s ease-out infinite', animationDelay: '2s' }} />
                  {/* Inner glow */}
                  <div className={`absolute inset-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-xl`} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                </>
              )}

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl`}>
                  <div className="scale-[3] text-white">
                    {icon}
                  </div>
                </div>
              </div>

              {/* Floating Cards - Dynamic Positions */}
              {floatingCards.map((card, i) => (
                <div
                  key={i}
                  className={`absolute ${positionStyles[card.position]} px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border shadow-lg`}
                  style={{
                    animation: `floatCard ${3 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  <div className={`text-xs font-medium ${card.color}`}>{card.value}</div>
                  <div className="text-[10px] text-muted-foreground">{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes cubeRotate {
          0%, 100% { transform: rotateX(15deg) rotateY(-15deg); }
          50% { transform: rotateX(-15deg) rotateY(15deg); }
        }

        @keyframes wave {
          0%, 100% { transform: scaleX(1.5) translateX(-10%); }
          50% { transform: scaleX(1.5) translateX(10%); }
        }

        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.3; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        @keyframes nodePulse {
          0%, 100% { r: 8; opacity: 0.3; }
          50% { r: 12; opacity: 0.5; }
        }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>
    </section>
  )
}
