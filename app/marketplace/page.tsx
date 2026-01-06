import Link from "next/link"
import { getProducts, getCategories, formatPrice } from "@/lib/marketplace/products"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Bot, Zap, Sparkles, BarChart, Search, Filter } from "lucide-react"
import type { Metadata } from "next"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Marketplace - AI Apps & Automation Tools",
  description: "Browse and purchase AI-powered applications, automation tools, and business solutions. Buy, subscribe, or lease-to-own complete AI apps.",
  keywords: "AI marketplace, automation tools, AI apps, business software, lease to own software, AI agents",
  openGraph: {
    title: "RocketOpp Marketplace - AI Apps & Automation Tools",
    description: "Browse and purchase AI-powered applications, automation tools, and business solutions.",
    type: "website",
    url: "https://rocketopp.com/marketplace",
  },
}

const categoryIcons: Record<string, React.ElementType> = {
  'ai-agents': Bot,
  'automation': Zap,
  'crm': Rocket,
  'marketing': Sparkles,
  'analytics': BarChart,
}

export default async function MarketplacePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const products = await getProducts({
    category: params.category,
    status: 'active'
  })
  const comingSoon = await getProducts({ status: 'coming_soon' })
  const categories = await getCategories()

  const allProducts = [...products, ...comingSoon]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
              <span className="text-foreground">The AI App</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Complete AI applications ready to deploy. Buy outright, subscribe monthly, or lease-to-own.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search apps, tools, and integrations..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Link
              href="/marketplace"
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                !params.category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Filter className="w-4 h-4" />
              All
            </Link>
            {categories.map((cat: { slug: string; name: string }) => {
              const Icon = categoryIcons[cat.slug] || Rocket
              return (
                <Link
                  key={cat.slug}
                  href={`/marketplace?category=${cat.slug}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    params.category === cat.slug
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Featured Banner */}
          <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  First of Its Kind
                </span>
                <h2 className="text-2xl font-bold mt-2 mb-2">Lease-to-Own AI Apps</h2>
                <p className="text-muted-foreground">
                  Don't just rent software. Own it. Make monthly payments and keep it forever.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href="/marketplace/lease-to-own">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => {
              const Icon = categoryIcons[product.category] || Rocket
              return (
                <Link
                  key={product.id}
                  href={`/marketplace/${product.slug}`}
                  className="group relative rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {product.status === 'active' ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {product.is_featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                    <p className="text-primary font-medium text-sm mb-3">{product.tagline}</p>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.features.slice(0, 3).map((feature: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted">
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 3 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{product.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold">
                          {product.price === 0 ? 'Free' : formatPrice(product.price, product.price_type)}
                        </span>
                        {product.lease_terms && (
                          <span className="text-xs text-muted-foreground block">
                            or {formatPrice(product.lease_terms.monthly_payment, 'lease_to_own')}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {allProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Sell on the Marketplace?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Build AI apps that plug into the RocketOpp ecosystem. Reach thousands of businesses looking for automation solutions.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sellers">
              Become a Seller
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
