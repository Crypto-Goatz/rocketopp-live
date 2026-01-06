import Footer from "@/components/footer"
import { Rocket, Zap, Clock, Brain } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "RocketOpp builds tools that work while you sleep. We're a small team that ships fast and hates busywork as much as you do.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
                We Build.
                <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent"> You Sleep.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                That's not just a tagline. It's the entire point.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold">The Short Version</h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We got tired of software that creates more work than it saves.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                You know the drill: You buy a tool to automate something. Then you spend weeks
                configuring it, learning the interface, connecting the integrations, debugging the
                errors. By the time it's "working," you've spent more time on the tool than the
                task it was supposed to handle.
              </p>

              <p className="text-lg text-foreground font-medium">
                We decided to build different.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Our tools don't need babysitting. You describe what you want to happen,
                and they figure out how to make it happen. They think for themselves, adapt
                when things change, and run in the background while you focus on what actually
                matters.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We're a small team. We ship fast. We delete features that don't work.
                We care more about whether the tool saves you time than whether it looks
                impressive in a demo.
              </p>
            </div>
          </div>
        </section>

        {/* What We Believe Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">What We Believe</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Time is the real currency</h3>
                  <p className="text-muted-foreground">
                    Every hour you spend on repetitive tasks is an hour stolen from growing your
                    business, being with family, or doing what you actually love. Software should
                    give you time back, not take it.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI should do the thinking</h3>
                  <p className="text-muted-foreground">
                    You shouldn't need to learn a new system. You shouldn't need to configure
                    fifty settings. Tell the tool what you want in plain English. Let it figure
                    out the rest.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Shipping beats planning</h3>
                  <p className="text-muted-foreground">
                    We'd rather ship something real today and iterate than spend months planning
                    the perfect thing. Working software that solves a problem is better than a
                    beautiful roadmap that doesn't.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Ecosystems beat products</h3>
                  <p className="text-muted-foreground">
                    One tool is good. Tools that talk to each other are better. Everything we
                    build is designed to work together, so your automations can compound instead
                    of compete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              That's the story.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              If you hate busywork as much as we do, you'll probably like what we build.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
