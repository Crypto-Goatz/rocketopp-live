"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { ReactNode } from "react"

interface ServiceHeroProps {
  icon: ReactNode
  title: string
  subtitle: string
  description: string
  gradient: string
  stats: { label: string; value: string }[]
  ctaText?: string
  ctaHref?: string
}

export function ServiceHero({
  icon,
  title,
  subtitle,
  description,
  gradient,
  stats,
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
              {/* Main Circle */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} opacity-10`} />

              {/* Orbiting Elements */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-current opacity-10 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-12 rounded-full border-2 border-dashed border-current opacity-10 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
              <div className="absolute inset-20 rounded-full border-2 border-dashed border-current opacity-10 animate-spin" style={{ animationDuration: '15s' }} />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl`}>
                  <div className="scale-[3] text-white">
                    {icon}
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-8 right-8 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="text-xs font-medium text-green-500">+127%</div>
                <div className="text-[10px] text-muted-foreground">Growth</div>
              </div>

              <div className="absolute bottom-8 left-8 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border shadow-lg animate-bounce" style={{ animationDuration: '3.5s' }}>
                <div className="text-xs font-medium text-primary">24/7</div>
                <div className="text-[10px] text-muted-foreground">Support</div>
              </div>

              <div className="absolute top-1/2 -right-4 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="text-xs font-medium text-blue-500">99.9%</div>
                <div className="text-[10px] text-muted-foreground">Uptime</div>
              </div>
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
      `}</style>
    </section>
  )
}
