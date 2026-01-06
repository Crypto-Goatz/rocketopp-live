import type { Metadata } from "next"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, ThumbsUp, MessageSquare, TrendingUp, Target, BarChart3, Sparkles, Globe, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Social Media Marketing Services | 25+ Years Experience | RocketOpp",
  description:
    "Expert social media marketing services from RocketOpp. Drive engagement, build brand loyalty, and convert followers into customers across Facebook, Instagram, LinkedIn, TikTok, and more. Proven strategies since 2000.",
  keywords:
    "social media marketing, social media management, Instagram marketing, Facebook advertising, TikTok marketing, LinkedIn marketing, social media strategy, content creation, influencer marketing, social commerce",
  openGraph: {
    title: "Social Media Marketing Services | RocketOpp",
    description:
      "Transform your social presence with data-driven strategies. Expert social media marketing with 25+ years of proven results.",
    type: "website",
  },
}

const socialStrategies = [
  {
    icon: Sparkles,
    title: "Short-Form Video Content",
    description:
      "Dominating platforms like TikTok, Instagram Reels, and YouTube Shorts for high engagement and viral reach.",
    stats: "85% higher engagement",
  },
  {
    icon: Users,
    title: "Influencer Marketing",
    description:
      "Strategic partnerships with micro and niche influencers for authentic audience connections and trust-building.",
    stats: "11x ROI average",
  },
  {
    icon: Target,
    title: "Social Commerce Integration",
    description:
      "Seamless shopping experiences directly within social platforms, reducing friction and increasing conversions.",
    stats: "43% conversion lift",
  },
  {
    icon: ThumbsUp,
    title: "User-Generated Content (UGC)",
    description: "Leveraging customer content to build trust, authenticity, and community-driven brand advocacy.",
    stats: "4x higher CTR",
  },
  {
    icon: Globe,
    title: "Augmented Reality (AR) Experiences",
    description: "Interactive AR filters and immersive ads that drive engagement and memorable brand experiences.",
    stats: "94% higher engagement",
  },
  {
    icon: TrendingUp,
    title: "AI-Powered Personalization",
    description: "Data-driven content tailoring and predictive analytics for maximum relevance and engagement.",
    stats: "60% better results",
  },
]

const platforms = [
  {
    name: "Instagram",
    focus: "Visual storytelling, Reels, Shopping",
    audience: "1B+ monthly users",
  },
  {
    name: "Facebook",
    focus: "Community building, Ads, Groups",
    audience: "3B+ monthly users",
  },
  {
    name: "LinkedIn",
    focus: "B2B marketing, Thought leadership",
    audience: "900M+ professionals",
  },
  {
    name: "TikTok",
    focus: "Viral video, Trends, Gen Z reach",
    audience: "1.6B+ monthly users",
  },
  {
    name: "YouTube",
    focus: "Long-form video, Shorts, Education",
    audience: "2.7B+ monthly users",
  },
  {
    name: "X (Twitter)",
    focus: "Real-time engagement, News, Updates",
    audience: "550M+ monthly users",
  },
]

const processSteps = [
  {
    step: "01",
    title: "Audit & Strategy",
    description:
      "Comprehensive analysis of current social presence, competitor research, and custom strategy development aligned with business goals.",
  },
  {
    step: "02",
    title: "Content Planning",
    description:
      "Strategic content calendar creation, platform-specific formatting, and audience-targeted messaging that drives engagement.",
  },
  {
    step: "03",
    title: "Creation & Optimization",
    description:
      "Professional content creation including graphics, videos, copy, and hashtag research optimized for each platform's algorithm.",
  },
  {
    step: "04",
    title: "Community Management",
    description:
      "Active engagement, response management, reputation monitoring, and relationship building with your audience.",
  },
  {
    step: "05",
    title: "Analytics & Reporting",
    description:
      "Data-driven performance tracking, ROI measurement, and continuous optimization based on real-time insights.",
  },
]

const benefits = [
  {
    title: "Increased Brand Awareness",
    description:
      "Expand your reach exponentially with targeted campaigns that get your brand in front of the right audiences.",
  },
  {
    title: "Enhanced Customer Engagement",
    description:
      "Build meaningful relationships through authentic interactions, responding to comments, and fostering community.",
  },
  {
    title: "Higher Conversion Rates",
    description:
      "Turn social followers into paying customers with strategic calls-to-action and optimized sales funnels.",
  },
  {
    title: "Improved Customer Loyalty",
    description:
      "Create brand advocates through consistent value delivery, exclusive content, and personalized experiences.",
  },
  {
    title: "Competitive Advantage",
    description:
      "Stay ahead of competitors by leveraging emerging trends, platform features, and innovative strategies first.",
  },
  {
    title: "Cost-Effective Marketing",
    description:
      "Achieve higher ROI compared to traditional advertising with precise targeting and measurable results.",
  },
]

const faqItems = [
  {
    question: "Which social media platforms should my business be on?",
    answer:
      "Platform selection depends on your target audience, business type, and goals. B2B companies typically excel on LinkedIn, while B2C brands often thrive on Instagram, Facebook, and TikTok. We analyze your specific situation and recommend the platforms where your audience is most active and engaged.",
  },
  {
    question: "How long does it take to see results from social media marketing?",
    answer:
      "Initial engagement typically appears within 2-4 weeks, but substantial growth and ROI usually manifest within 3-6 months of consistent strategy implementation. Social media success compounds over time as your audience grows and algorithms favor your consistent, quality content.",
  },
  {
    question: "Do you create content or do we provide it?",
    answer:
      "We offer both options based on your needs. Our team can handle complete content creation including graphics, videos, and copywriting, or we can work with your provided content and optimize it for each platform. Most clients prefer our full-service approach for consistent, professional results.",
  },
  {
    question: "How do you measure social media marketing success?",
    answer:
      "We track comprehensive metrics including reach, engagement rate, follower growth, website traffic, lead generation, and conversion attribution. Custom dashboards provide real-time insights, and monthly reports detail ROI, cost-per-acquisition, and progress toward your specific business objectives.",
  },
  {
    question: "What makes your social media marketing different?",
    answer:
      "With 25+ years of digital marketing experience, we combine proven strategies with cutting-edge AI technology. We don't just post content—we build comprehensive systems that integrate social media with your entire marketing ecosystem, using data-driven insights to continuously optimize performance and maximize ROI.",
  },
]

export default function SocialMediaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="py-20 md:py-28 bg-primary/5 dark:bg-primary/10 relative"
          style={{
            backgroundImage: "url(/photorealistic-astronaut-social-media-engagement.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
          <div className="container text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">25+ Years Digital Marketing Experience</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
              Social Media Marketing That Drives Real Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform your social presence into a customer acquisition engine. Expert strategies across Instagram,
              Facebook, TikTok, LinkedIn, and more—backed by data, driven by results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/#contact?service=social-media-marketing">Get Your Free Strategy Session</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                <Link href="/ai-assessment">Free Social Media Audit</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500M+</div>
                <div className="text-sm text-muted-foreground">Social Impressions</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">285%</div>
                <div className="text-sm text-muted-foreground">Avg ROI Increase</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Social Media Matters */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Why Social Media Marketing Is Essential in 2025</h2>
              <p className="text-lg text-muted-foreground">
                With over 5 billion social media users worldwide, your customers are already on social
                platforms—discovering brands, engaging with content, and making purchase decisions. The question isn't
                whether you should be there, but how effectively you're capturing their attention.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-6 bg-card rounded-lg border hover:border-primary transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Expertise */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Multi-Platform Expertise</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each platform has unique algorithms, audience behaviors, and best practices. We master them all to
                maximize your ROI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform) => (
                <div key={platform.name} className="p-6 bg-card rounded-lg shadow-sm border">
                  <h3 className="text-2xl font-bold text-primary mb-2">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{platform.audience}</p>
                  <p className="font-medium">{platform.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strategies Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Cutting-Edge Social Media Strategies</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We leverage the latest trends and technologies to keep your brand ahead of the competition.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {socialStrategies.map((strategy) => {
                const IconComponent = strategy.icon
                return (
                  <div
                    key={strategy.title}
                    className="p-6 bg-card rounded-lg shadow-lg border hover:shadow-xl transition-shadow"
                  >
                    <IconComponent className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{strategy.title}</h3>
                    <p className="text-muted-foreground mb-3">{strategy.description}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">{strategy.stats}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Proven 5-Step Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From strategy to execution, we handle everything to grow your social media presence and drive measurable
                results.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {processSteps.map((process) => (
                <div key={process.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {process.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{process.title}</h3>
                    <p className="text-muted-foreground text-lg">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our social media marketing services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="p-6 bg-card rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Social Presence?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Stop posting into the void. Start building a social media presence that drives real business growth with
              strategies proven over 25 years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link href="/#contact?service=social-media-marketing">Schedule Free Consultation</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/ai-assessment">Get Free Audit</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
