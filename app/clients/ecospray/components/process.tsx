"use client"

import { Phone, ClipboardCheck, Hammer, ThumbsUp } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: Phone,
    title: "Free Consultation",
    description: "Call us or fill out our form. We'll discuss your project and schedule a convenient time to visit your property.",
  },
  {
    step: 2,
    icon: ClipboardCheck,
    title: "Energy Assessment",
    description: "Our experts inspect your space, identify problem areas, and provide a detailed proposal with upfront pricing.",
  },
  {
    step: 3,
    icon: Hammer,
    title: "Professional Installation",
    description: "Our trained crews install your spray foam insulation quickly and cleanly, with minimal disruption to your routine.",
  },
  {
    step: 4,
    icon: ThumbsUp,
    title: "Enjoy the Savings",
    description: "Start saving on energy bills immediately. Feel the difference in comfort and enjoy peace of mind for years to come.",
  },
]

export default function EcosprayProcess() {
  return (
    <section id="process" className="py-20 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            From first call to final inspection, we make the process simple and stress-free.
            Here&apos;s what to expect when you work with EcoSpray Solutions.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-green-500/50 via-green-500 to-green-500/50" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="relative">
                {/* Step Card */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 hover:border-green-500/50 transition-all h-full">
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-950 border-2 border-green-500 flex items-center justify-center">
                      <span className="text-sm font-bold text-green-400">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white text-center mb-3">{step.title}</h3>
                  <p className="text-sm text-zinc-400 text-center">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
