import Link from "next/link"
import { getSession } from "@/lib/auth/session"
import { getUserPurchases } from "@/lib/marketplace/products"
import { Button } from "@/components/ui/button"
import {
  Rocket, Package, Sparkles, Zap, ArrowRight,
  Gift, Trophy, Target, TrendingUp, Clock,
  CheckCircle, Star, Fuel, ChevronRight
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | RocketOpp",
  description: "Your RocketOpp workspace",
}

const quickActions = [
  {
    name: "AI Content Writer",
    description: "Generate blog posts, ads, emails",
    icon: Sparkles,
    href: "/dashboard/tools/content-writer",
    color: "from-purple-500 to-pink-500",
    fuelCost: 10
  },
  {
    name: "Image Generator",
    description: "Create stunning visuals with AI",
    icon: Zap,
    href: "/dashboard/tools/image-generator",
    color: "from-blue-500 to-cyan-500",
    fuelCost: 25
  },
  {
    name: "SEO Analyzer",
    description: "Optimize your content for search",
    icon: Target,
    href: "/dashboard/tools/seo-analyzer",
    color: "from-green-500 to-emerald-500",
    fuelCost: 15
  },
]

const recentActivity = [
  { action: "Signed up", points: 100, time: "Just now" },
]

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) return null

  const purchases = await getUserPurchases(user.id)
  const fuelCredits = (user as { fuel_credits?: number }).fuel_credits || 100

  // Calculate profile completion
  const profileFields = [user.name, user.email]
  const completedFields = profileFields.filter(Boolean).length
  const profileCompletion = Math.round((completedFields / 5) * 100) // Assuming 5 total profile fields

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome back{user.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-white/50">
          Here's what's happening in your workspace today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
              <Fuel className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{fuelCredits.toLocaleString()}</p>
          <p className="text-xs text-white/40">Fuel Credits</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{purchases.length}</p>
          <p className="text-xs text-white/40">Apps Owned</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{profileCompletion}%</p>
          <p className="text-xs text-white/40">Profile Complete</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white capitalize">{(user as { subscription_status?: string }).subscription_status || 'Free'}</p>
          <p className="text-xs text-white/40">Account Tier</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free AI Tools */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Free AI Tools
                </h2>
                <p className="text-sm text-white/40">Use your fuel credits to power AI</p>
              </div>
              <Link
                href="/dashboard/tools"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group p-4 rounded-xl bg-black/50 border border-white/5 hover:border-primary/30 hover:bg-black/80 transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{action.name}</h3>
                  <p className="text-xs text-white/40 mb-2">{action.description}</p>
                  <div className="flex items-center gap-1 text-xs text-orange-400">
                    <Fuel className="w-3 h-3" />
                    {action.fuelCost} fuel
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Your Apps */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Your Apps
              </h2>
              <Link
                href="/marketplace"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Browse Marketplace
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {purchases.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40 mb-4">No apps yet. Explore the marketplace!</p>
                <Button size="sm" asChild>
                  <Link href="/marketplace">
                    Explore Apps
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {purchases.slice(0, 3).map((purchase: { id: string; product: { name: string; tagline: string; slug: string } | null; status: string }) => (
                  <Link
                    key={purchase.id}
                    href={`/marketplace/${purchase.product?.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-red-500 flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{purchase.product?.name}</p>
                        <p className="text-xs text-white/40">{purchase.product?.tagline}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      purchase.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 text-white/40'
                    }`}>
                      {purchase.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Complete Profile Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-red-500/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-white">Complete Your Profile</h3>
            </div>
            <p className="text-sm text-white/50 mb-4">
              Earn 500 bonus fuel credits by completing your profile!
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${user.email ? 'text-green-400' : 'text-white/20'}`} />
                <span className={user.email ? 'text-white/70' : 'text-white/30'}>Add email</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${user.name ? 'text-green-400' : 'text-white/20'}`} />
                <span className={user.name ? 'text-white/70' : 'text-white/30'}>Add your name</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-white/20" />
                <span className="text-white/30">Add company info</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-white/20" />
                <span className="text-white/30">Select specializations</span>
              </div>
            </div>
            <Button size="sm" className="w-full" asChild>
              <Link href="/dashboard/profile">
                Complete Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/40" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white/70">{item.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">+{item.points}</span>
                    <Fuel className="w-3 h-3 text-orange-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/company"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Set up company profile
              </Link>
              <Link
                href="/dashboard/tags"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Add your specializations
              </Link>
              <Link
                href="/dashboard/fuel"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Earn more fuel credits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
