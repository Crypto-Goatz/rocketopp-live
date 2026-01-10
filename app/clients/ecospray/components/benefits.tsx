"use client"

import {
  Zap, Wind, Droplets, Volume2, Calendar, Leaf,
  CheckCircle2
} from "lucide-react"
import { Card } from "@/components/ui/card"

const benefits = [
  {
    icon: Zap,
    title: "Energy Savings",
    description: "Reduce heating and cooling costs by up to 50% with superior thermal performance.",
    stat: "50%",
    statLabel: "Lower Bills",
  },
  {
    icon: Wind,
    title: "Air Sealing",
    description: "Spray foam expands to fill gaps and cracks, creating an airtight barrier against drafts.",
    stat: "100%",
    statLabel: "Coverage",
  },
  {
    icon: Droplets,
    title: "Moisture Barrier",
    description: "Closed-cell foam prevents moisture intrusion, protecting against mold and rot.",
    stat: "Zero",
    statLabel: "Moisture",
  },
  {
    icon: Volume2,
    title: "Noise Reduction",
    description: "Enjoy a quieter home with spray foam's excellent sound-dampening properties.",
    stat: "80%",
    statLabel: "Quieter",
  },
  {
    icon: Calendar,
    title: "Long Lasting",
    description: "Unlike traditional insulation, spray foam won't sag, settle, or degrade over time.",
    stat: "25+",
    statLabel: "Years",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Reduce your carbon footprint with energy-efficient insulation that lasts.",
    stat: "Green",
    statLabel: "Choice",
  },
]

const whyChoose = [
  "Locally owned and operated in Murrysville, PA",
  "Licensed, bonded, and fully insured",
  "Free on-site estimates with detailed proposals",
  "Clean, professional installation crews",
  "Lifetime warranty on all workmanship",
  "Financing options available",
]

export default function EcosprayBenefits() {
  return (
    <section id="benefits" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Spray Foam
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Spray foam insulation outperforms traditional materials in every category.
            Here&apos;s what makes it the smart choice for Pittsburgh homes.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="p-6 bg-zinc-900/50 border-zinc-800 hover:border-green-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center border border-green-500/30">
                  <benefit.icon className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{benefit.stat}</div>
                  <div className="text-xs text-zinc-500">{benefit.statLabel}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-zinc-400">{benefit.description}</p>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-green-950/50 to-emerald-950/50 rounded-2xl p-8 md:p-12 border border-green-500/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Why Choose EcoSpray Solutions?
              </h3>
              <p className="text-zinc-400 mb-6">
                We&apos;re not just another insulation company. We&apos;re your neighbors,
                committed to making Pittsburgh homes more comfortable and energy-efficient.
              </p>
            </div>
            <div className="space-y-3">
              {whyChoose.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
