import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug, formatPrice, getProductSchema } from "@/lib/marketplace/products"
import { getSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import {
  Rocket, ArrowLeft, ExternalLink, Check, Star, Shield, Zap,
  Users, Clock, Code2, Bot
} from "lucide-react"
import type { Metadata } from "next"
import Footer from "@/components/footer"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: product.seo_title || `${product.name} - ${product.tagline}`,
    description: product.seo_description || product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      url: `https://rocketopp.com/marketplace/${slug}`,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  }
}

const categoryIcons: Record<string, React.ElementType> = {
  'ai-agents': Bot,
  'automation': Zap,
  'crm': Rocket,
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const user = await getSession()

  if (!product) {
    notFound()
  }

  const Icon = categoryIcons[product.category] || Rocket
  const schema = getProductSchema(product)

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Product Info */}
            <div>
              {/* Status Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  product.status === 'active'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {product.status === 'active' ? 'Available Now' : 'Coming Soon'}
                </span>
                {product.is_featured && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Featured
                  </span>
                )}
                {product.is_rocketopp_product && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    By RocketOpp
                  </span>
                )}
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-red-500 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black">{product.name}</h1>
                  <p className="text-xl text-primary font-medium">{product.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8">
                {product.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground text-sm">rating</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{product.downloads || 0}</span>
                  <span className="text-muted-foreground text-sm">users</span>
                </div>
                {product.tech_stack && (
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                      {product.tech_stack.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Long Description */}
              {product.long_description && (
                <div className="prose prose-invert max-w-none mb-8">
                  <p>{product.long_description}</p>
                </div>
              )}
            </div>

            {/* Right - Purchase Card */}
            <div>
              <div className="sticky top-24 p-8 rounded-2xl bg-card border border-border">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black">
                      {product.price === 0 ? 'Free' : formatPrice(product.price, product.price_type)}
                    </span>
                  </div>

                  {/* Lease Option */}
                  {product.lease_terms && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-4">
                      <p className="text-sm font-medium text-primary mb-1">
                        Lease-to-Own Available
                      </p>
                      <p className="text-2xl font-bold">
                        ${product.lease_terms.monthly_payment}/mo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        for {product.lease_terms.total_months} months, then it's yours forever
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA */}
                {product.status === 'active' ? (
                  <div className="space-y-3">
                    {user ? (
                      <>
                        <Button size="lg" className="w-full h-14 text-lg">
                          Get {product.name}
                        </Button>
                        {product.lease_terms && (
                          <Button size="lg" variant="outline" className="w-full h-12">
                            Start Lease-to-Own
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button size="lg" className="w-full h-14 text-lg" asChild>
                          <Link href={`/login?redirect=/marketplace/${slug}`}>
                            Sign in to Purchase
                          </Link>
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                          <Link href="/register" className="text-primary hover:underline">
                            Create an account
                          </Link>{" "}
                          to get started
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button size="lg" className="w-full h-14 text-lg" disabled>
                      Coming Soon
                    </Button>
                    <Button size="lg" variant="outline" className="w-full h-12">
                      Notify Me When Available
                    </Button>
                  </div>
                )}

                {/* Trust Signals */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>30-day money back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Instant access after purchase</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Lifetime updates included</span>
                  </div>
                </div>

                {/* External Links */}
                {(product.demo_url || product.docs_url) && (
                  <div className="mt-6 pt-6 border-t border-border flex gap-3">
                    {product.demo_url && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {product.docs_url && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={product.docs_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Documentation
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">What's Included</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Providers */}
      {product.ai_providers && product.ai_providers.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">AI Compatibility</h2>
            <p className="text-muted-foreground mb-6">
              This product works with the following AI providers. Swap between them at any time.
            </p>
            <div className="flex flex-wrap gap-3">
              {product.ai_providers.map((provider: string) => (
                <div key={provider} className="px-4 py-2 rounded-lg bg-card border border-border">
                  <span className="capitalize">{provider}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
