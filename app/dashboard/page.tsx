import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth/session"
import { getUserPurchases } from "@/lib/marketplace/products"
import { Button } from "@/components/ui/button"
import { Rocket, Package, Settings, LogOut, ExternalLink, ShoppingBag } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your RocketOpp products and subscriptions",
}

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  const purchases = await getUserPurchases(user.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-red-500 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">RocketOpp</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href="/marketplace"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
              <form action="/api/auth/logout" method="POST">
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Manage your products and explore the marketplace
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold">{purchases.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Products Owned</p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-2xl font-bold">
                {purchases.filter(p => p.status === 'active').length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-2xl font-bold capitalize">
                {user.subscription_status || 'Free'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Account Tier</p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Products</h2>
            <Button asChild>
              <Link href="/marketplace">
                Browse Marketplace
              </Link>
            </Button>
          </div>

          {purchases.length === 0 ? (
            <div className="p-12 rounded-xl bg-card border border-border text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Explore our marketplace to find AI tools that work for you
              </p>
              <Button asChild>
                <Link href="/marketplace">
                  Explore Marketplace
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {purchases.map((purchase: { id: string; product: { name: string; tagline: string; slug: string } | null; purchase_type: string; status: string }) => (
                <div
                  key={purchase.id}
                  className="p-6 rounded-xl bg-card border border-border flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{purchase.product?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {purchase.product?.tagline}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        purchase.status === 'active'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {purchase.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {purchase.purchase_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/marketplace/${purchase.product?.slug}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
