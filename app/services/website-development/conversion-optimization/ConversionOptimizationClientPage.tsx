"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const trackingCapabilities = [
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Time on Page Analytics",
    description:
      "Track exactly how long visitors spend on each page and section. Identify content that captivates and content that loses attention.",
    metrics: ["Average session duration", "Page-level engagement", "Section scroll depth", "Content consumption rate"],
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Idle Time Detection",
    description:
      "Measure periods of inactivity to understand when visitors lose interest or get distracted. Optimize content placement based on engagement patterns.",
    metrics: [
      "Idle duration tracking",
      "Re-engagement triggers",
      "Attention span analysis",
      "Drop-off point identification",
    ],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Tab Visibility Monitoring",
    description:
      "Know when your site is hidden versus actively viewed. Understand true engagement versus passive tab presence.",
    metrics: ["Active view time", "Tab switch patterns", "Return behavior", "Multi-tab usage analysis"],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Mouse Movement Heatmaps",
    description:
      "Track every cursor movement to understand what draws attention. Identify hot zones and dead zones on your pages.",
    metrics: ["Movement patterns", "Hover duration", "Cursor trajectory", "Attention heatmaps"],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Click & Interaction Tracking",
    description:
      "Record every click, form interaction, and button press. Understand exactly how visitors navigate and interact with your site.",
    metrics: ["Click maps", "Button performance", "Form field analysis", "Navigation patterns"],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Highlight & Selection Analysis",
    description:
      "Track text highlighting and copying behavior to identify the most valuable content. See what resonates with your audience.",
    metrics: ["Text selection frequency", "Copy behavior", "Quote extraction", "Content interest signals"],
  },
]

const aiOptimizationFeatures = [
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Self-Learning AI Engine",
    description:
      "Our proprietary AI continuously analyzes visitor behavior patterns and automatically implements optimizations without manual intervention.",
    capabilities: [
      "Pattern recognition across thousands of sessions",
      "Predictive behavior modeling",
      "Automatic hypothesis generation",
      "Real-time optimization deployment",
    ],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Dynamic Content Optimization",
    description:
      "Content automatically adapts based on visitor behavior. Headlines, copy, and messaging evolve to maximize engagement and conversions.",
    capabilities: [
      "Headline A/B/n testing",
      "Copy length optimization",
      "CTA text refinement",
      "Value proposition testing",
    ],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Intelligent Color Adaptation",
    description:
      "AI tests and implements color variations for buttons, headers, and key elements to find the optimal palette for conversions.",
    capabilities: [
      "Button color optimization",
      "Contrast adjustment",
      "Brand-compliant variations",
      "Seasonal color adaptation",
    ],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Image Performance Testing",
    description:
      "Automatically test different images, sizes, and placements. AI selects visuals that drive the highest engagement and trust.",
    capabilities: [
      "Hero image variations",
      "Product image optimization",
      "Lifestyle vs product testing",
      "Image placement analysis",
    ],
  },
]

const trafficIntelligence = [
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Good Traffic Identification",
    description:
      "AI identifies high-intent visitors based on behavior patterns—those who engage deeply, spend quality time, and show buying signals.",
    indicators: ["Multiple page visits", "Long engagement times", "Form interactions", "Product/service exploration"],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Bad Traffic Filtering",
    description:
      "Automatically detect and deprioritize low-quality traffic—bots, accidental visits, and users with no conversion intent.",
    indicators: [
      "Bounce within 3 seconds",
      "Bot-like behavior patterns",
      "Zero interaction signals",
      "Geographic anomalies",
    ],
  },
]

const conversionImpact = [
  {
    stat: "127%",
    label: "Average conversion rate improvement",
    description: "Businesses using our AI optimization see conversions more than double within 90 days.",
  },
  {
    stat: "89%",
    label: "Reduction in manual optimization time",
    description: "No more guessing or manual A/B test setup. The AI handles everything automatically.",
  },
  {
    stat: "24/7",
    label: "Continuous optimization",
    description: "Your site improves around the clock, learning from every single visitor interaction.",
  },
  {
    stat: "$2.3M",
    label: "Average additional revenue in first year",
    description: "Our clients see substantial revenue increases from improved conversion rates.",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "Comprehensive Tracking Implementation",
    description:
      "We install advanced behavioral tracking across your entire website—capturing every interaction, movement, and engagement signal.",
  },
  {
    step: "02",
    title: "AI Learning Phase",
    description:
      "The AI observes thousands of visitor sessions, identifying patterns that correlate with conversions and building predictive models.",
  },
  {
    step: "03",
    title: "Automated Testing & Optimization",
    description:
      "AI begins testing variations of content, colors, images, and layouts—automatically implementing winners and discarding losers.",
  },
  {
    step: "04",
    title: "Continuous Improvement",
    description:
      "Your website perpetually evolves, getting better with every visitor. Conversion rates compound over time as the AI learns more.",
  },
]

export default function ConversionOptimizationClientPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="pt-32 pb-20 px-4 relative overflow-hidden"
        style={{
          backgroundImage: "url(/photorealistic-astronaut-optimizing-conversion.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center space-y-6">
            <motion.div variants={fadeInUp} className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                AI-Powered Conversion Optimization
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-balance">
              Your Website That
              <br />
              <span className="text-primary">Optimizes Itself</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Revolutionary self-optimizing AI technology that tracks every visitor behavior, automatically tests
              variations, and continuously improves your conversion rates—without you lifting a finger.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/ai-assessment-start">
                  See AI Optimization Demo
                  {/* <ArrowRight className="ml-2 h-5 w-5" /> */}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* </CHANGE> */}

      {/* Conversion Impact Stats */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              Proven <span className="text-primary">Results</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real data from businesses using our self-optimizing AI technology
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversionImpact.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="text-5xl font-bold text-primary mb-2">{item.stat}</div>
                  <div className="font-semibold text-lg mb-2">{item.label}</div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Tracking Capabilities */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Advanced Behavioral</span> Tracking
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We track everything. Every mouse movement, every second, every interaction. This data powers the AI
              optimization engine.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trackingCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/20">
                  <div className="text-primary mb-4">{capability.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
                  <p className="text-muted-foreground mb-4">{capability.description}</p>
                  <ul className="space-y-2">
                    {capability.metrics.map((metric, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        {/* <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> */}
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Optimization Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Self-Optimizing</span> Technology
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI doesn't just track—it acts. Automatically testing and implementing optimizations that increase
              conversions.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {aiOptimizationFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full bg-background/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/20">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.capabilities.map((capability, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {/* <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> */}
                        <span className="text-sm">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Traffic Intelligence */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Traffic Intelligence</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Not all traffic is created equal. Our AI distinguishes high-intent visitors from time-wasters.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {trafficIntelligence.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full bg-background/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-foreground mb-2">Key Indicators:</div>
                    <ul className="space-y-2">
                      {feature.indicators.map((indicator, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          {/* <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> */}
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              How It <span className="text-primary">Works</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From implementation to continuous improvement—here's how your website becomes self-optimizing
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 leading-none">
                    {step.step}
                  </div>
                  <div className="relative">
                    <div className="text-2xl font-bold text-primary mb-3">{step.step}</div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold">
              Stop Guessing. Start <span className="text-primary">Converting.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let AI handle your conversion optimization while you focus on running your business. Your website will
              literally get better every single day.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/ai-assessment-start">
                  Request CRO Analysis
                  {/* <ArrowRight className="ml-2 h-5 w-5" /> */}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                <Link href="/services">View All Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
