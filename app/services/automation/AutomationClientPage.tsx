"use client"

import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  Workflow,
  Bot,
  Zap,
  Users,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  Target,
  BarChart3,
  Cog,
  Brain,
} from "lucide-react"

export default function AutomationClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section
        className="pt-24 pb-20 px-4 relative"
        style={{
          backgroundImage: "url(/photorealistic-astronaut-controlling-automated.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              AI-Powered Business Automation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your operations with intelligent automation that combines AI technology with human expertise. 25
              years of proven results scaling businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/ai-assessment-start">Get Your Automation Assessment</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/contact">Schedule a Consultation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Truth About Automation */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">The Real Power of AI Automation</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                AI can replace entire departments—but it shouldn't. Here's why human-operated automation wins every
                time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <Card className="p-8 bg-card/50 backdrop-blur border-border/40">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <Bot className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="text-2xl font-bold">Automation Alone Fails</h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>No adaptability to changing business conditions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Breaks when unexpected situations arise</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Lacks human judgment for edge cases</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Misses opportunities for optimization</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Cannot handle customer relationships</span>
                    </li>
                  </ul>
                </div>
              </Card>

              <Card className="p-8 bg-primary/5 backdrop-blur border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Human-Operated Automation Thrives</h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Adapts to new challenges and opportunities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Employees manage edge cases with AI support</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Continuous improvement through human oversight</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Maintains the human touch in customer interactions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Empowers employees to focus on high-value work</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 25 Years of Experience */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full">
              <p className="text-primary font-semibold">25 Years of Proven Results</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Mastering Business Growth Through
              <br />
              <span className="text-primary">Automated Workflows with Human Operators</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              For over two decades, we've scaled businesses by leveraging every new technology available. Our secret?
              Combining cutting-edge automation with skilled human oversight. This is the key ingredient to truly
              successful Standard Operating Procedures (SOPs).
            </p>

            <div className="grid md:grid-cols-4 gap-6 pt-12">
              <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/40">
                <div className="text-4xl font-bold text-primary mb-2">25+</div>
                <p className="text-muted-foreground">Years of Experience</p>
              </Card>
              <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/40">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Businesses Scaled</p>
              </Card>
              <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/40">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Hours Saved Monthly</p>
              </Card>
              <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/40">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Automate */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Workflows We Transform with AI</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From repetitive tasks to complex processes, we automate what matters while keeping humans in control.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Workflow className="h-6 w-6" />,
                  title: "Data Entry & Processing",
                  description:
                    "AI captures, validates, and routes data automatically. Your team verifies exceptions and maintains quality.",
                  time: "Save 40+ hours/week",
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  title: "Lead Qualification",
                  description:
                    "AI scores and routes leads instantly. Your sales team focuses only on high-intent prospects.",
                  time: "Increase conversions 3x",
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Report Generation",
                  description:
                    "AI compiles data and generates insights. Your team reviews, refines, and acts on intelligence.",
                  time: "Save 20+ hours/week",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Customer Onboarding",
                  description:
                    "AI guides customers through processes. Your team handles complex questions and builds relationships.",
                  time: "Reduce onboarding time 60%",
                },
                {
                  icon: <Cog className="h-6 w-6" />,
                  title: "Inventory Management",
                  description:
                    "AI predicts demand and triggers reorders. Your team manages vendors and optimizes supply chain.",
                  time: "Reduce stockouts 80%",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Quality Assurance",
                  description:
                    "AI monitors processes and flags issues. Your team investigates root causes and implements fixes.",
                  time: "Catch errors 95% faster",
                },
                {
                  icon: <Brain className="h-6 w-6" />,
                  title: "Customer Support Triage",
                  description:
                    "AI handles common questions instantly. Your team focuses on complex issues requiring empathy.",
                  time: "Resolve tickets 50% faster",
                },
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "Marketing Campaigns",
                  description:
                    "AI personalizes content and optimizes timing. Your team creates strategy and creative direction.",
                  time: "Improve ROI 2-4x",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Workflow Orchestration",
                  description:
                    "AI coordinates tasks across systems. Your team manages exceptions and continuous improvement.",
                  time: "Save 30+ hours/week",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-primary/10 rounded-lg">{item.icon}</div>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {item.time}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The RocketOpp Automation Framework */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Our Proven Automation Framework</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Built from 25 years of scaling businesses, refined for the AI era.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Process Analysis",
                  description:
                    "We identify bottlenecks, repetitive tasks, and opportunities for intelligent automation.",
                },
                {
                  step: "02",
                  title: "AI Integration",
                  description:
                    "Deploy custom AI agents that handle routine work while flagging exceptions for human review.",
                },
                {
                  step: "03",
                  title: "Team Training",
                  description:
                    "Your employees learn to manage and optimize AI systems, becoming force multipliers for your business.",
                },
                {
                  step: "04",
                  title: "Continuous Optimization",
                  description:
                    "We monitor, measure, and refine workflows based on real data and human feedback for ongoing improvement.",
                },
              ].map((item, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5">{item.step}</div>
                  <div className="relative space-y-4">
                    <div className="text-primary font-bold text-lg">{item.step}</div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Human Operators Matter */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                Why Your Employees Are Essential
                <br />
                <span className="text-primary">To Successful Automation</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                AI handles the volume. Humans provide the judgment. Together, they create unstoppable growth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <Card className="p-8 bg-card/50 backdrop-blur border-border/40">
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Day-to-Day Management</h3>
                  <p className="text-muted-foreground">
                    Automation systems need monitoring, adjustment, and optimization. Your employees ensure everything
                    runs smoothly and identify improvement opportunities.
                  </p>
                </div>
              </Card>

              <Card className="p-8 bg-card/50 backdrop-blur border-border/40">
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Strategic Decision Making</h3>
                  <p className="text-muted-foreground">
                    AI provides data and recommendations, but humans make the final call on strategy, relationships, and
                    business direction based on context AI can't fully grasp.
                  </p>
                </div>
              </Card>

              <Card className="p-8 bg-card/50 backdrop-blur border-border/40">
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Continuous Improvement</h3>
                  <p className="text-muted-foreground">
                    Your team identifies new automation opportunities, refines existing workflows, and adapts to
                    changing business needs—keeping you ahead of competition.
                  </p>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Standard Operating Procedures */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                The Key Ingredient to
                <br />
                <span className="text-primary">Truly Successful SOPs</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Standard Operating Procedures fail when they're rigid documents gathering dust. They succeed when
                they're living systems powered by AI and managed by skilled operators. That's the RocketOpp difference.
              </p>
            </div>

            <Card className="p-10 bg-gradient-to-br from-primary/5 to-background border-primary/20 text-left">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Our SOPs Are:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-lg">Automated:</strong>
                      <span className="text-muted-foreground ml-2">
                        AI executes routine tasks consistently and accurately, 24/7 without fatigue.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-lg">Intelligent:</strong>
                      <span className="text-muted-foreground ml-2">
                        AI learns from patterns, suggests optimizations, and adapts to changing conditions.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-lg">Human-Guided:</strong>
                      <span className="text-muted-foreground ml-2">
                        Your team provides oversight, handles exceptions, and maintains the human touch that builds
                        relationships.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-lg">Continuously Improving:</strong>
                      <span className="text-muted-foreground ml-2">
                        Data-driven insights reveal bottlenecks and opportunities, creating a cycle of perpetual
                        optimization.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Transform Your Business
              <br />
              <span className="text-primary">With Intelligent Automation?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's analyze your workflows and show you exactly how much time and money you can save with our proven
              automation framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/ai-assessment-start">Get Your Free Automation Assessment</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/contact">Schedule a Call</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
