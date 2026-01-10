"use client"

import { Home, Building2, Warehouse, ClipboardCheck, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const services = [
  {
    icon: Home,
    title: "Residential Insulation",
    description: "Complete home insulation solutions including attics, walls, basements, and crawl spaces. Keep your family comfortable year-round.",
    features: ["Attic Insulation", "Wall Cavities", "Basement Sealing", "Crawl Spaces"],
  },
  {
    icon: Building2,
    title: "Commercial Insulation",
    description: "Energy-efficient insulation for offices, warehouses, and commercial buildings. Reduce operating costs and improve comfort.",
    features: ["Office Buildings", "Retail Spaces", "Warehouses", "Industrial"],
  },
  {
    icon: Warehouse,
    title: "New Construction",
    description: "Partner with builders for superior insulation in new homes and buildings. Meet energy codes and exceed expectations.",
    features: ["Builder Programs", "Code Compliance", "Custom Solutions", "Tight Deadlines"],
  },
  {
    icon: ClipboardCheck,
    title: "Energy Audits",
    description: "Comprehensive energy assessments to identify air leaks, insulation gaps, and opportunities for improvement.",
    features: ["Thermal Imaging", "Blower Door Tests", "Detailed Reports", "ROI Analysis"],
  },
]

export default function EcosprayServices() {
  return (
    <section id="services" className="py-20 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Insulation Services
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Professional spray foam insulation for every application. From cozy homes to
            large commercial spaces, we deliver superior results.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              className="p-6 bg-zinc-900/50 border-zinc-800 hover:border-green-500/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/clients/ecospray/contact"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors group"
          >
            Request a free consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
