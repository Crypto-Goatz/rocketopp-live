"use client"

import Link from "next/link"
import { ArrowRight, Calculator, Zap, Shield, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EcosprayHero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Save Up to 50% on Energy Bills</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Pittsburgh&apos;s{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Spray Foam Insulation
            </span>{" "}
            Experts
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Professional spray foam insulation for homes and businesses in Murrysville, PA and the greater Pittsburgh area.
            Lower energy costs, improved comfort, and lasting protection.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white group"
            >
              <Link href="/clients/ecospray/contact">
                Get Your Free Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              <a href="#calculator">
                <Calculator className="mr-2 w-4 h-4" />
                Calculate Savings
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-green-500" />
              <span>Energy Star Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              <span>10+ Years Experience</span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: "500+", label: "Projects Completed" },
            { value: "50%", label: "Avg. Energy Savings" },
            { value: "4.9", label: "Customer Rating" },
            { value: "10+", label: "Years Experience" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-green-400">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
