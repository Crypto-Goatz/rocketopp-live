"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Rocket, Home, Building2, User, Tag, Zap, Package,
  Settings, LogOut, HelpCircle, Sparkles, ChevronRight,
  Fuel, Gift, Trophy, Star, Wrench, MessageSquare,
  BarChart3, FileText, Layers, Users, Activity
} from "lucide-react"
import { useState } from "react"

interface WorkspaceLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    email: string
    name: string | null
    fuel_credits?: number
    subscription_status?: string
  }
  companyProfile?: {
    name?: string
    logo?: string
  } | null
}

const mainNavItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Company", href: "/dashboard/company", icon: Building2 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Specializations", href: "/dashboard/tags", icon: Tag },
]

const toolsNavItems = [
  { name: "AI Tools", href: "/dashboard/tools", icon: Sparkles, badge: "Free" },
  { name: "My Apps", href: "/dashboard/apps", icon: Package },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, badge: "Live" },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
]

const bottomNavItems = [
  { name: "Get Help", href: "/dashboard/help", icon: HelpCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function WorkspaceLayout({ children, user, companyProfile }: WorkspaceLayoutProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const fuelCredits = user.fuel_credits || 100 // Default starting fuel

  return (
    <div className="min-h-screen bg-black flex">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-red-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">RocketOpp</span>
            </Link>
            <div className="w-px h-6 bg-white/10" />
            <span className="text-sm text-white/40">Workspace</span>
          </div>

          {/* Fuel Display - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
              <Fuel className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">{fuelCredits.toLocaleString()}</span>
              <span className="text-xs text-orange-400/60">Fuel</span>
            </div>
            <Link
              href="/dashboard/fuel"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Get More
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-l border-white/5 bg-zinc-950/80 backdrop-blur-xl flex flex-col transition-all duration-300`}>
        {/* User Card */}
        <div className={`p-4 border-b border-white/5 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {sidebarCollapsed ? (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {user.name?.[0] || user.email[0].toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || 'Welcome'}
                </p>
                <p className="text-xs text-white/40 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Subscription Badge */}
          {!sidebarCollapsed && (
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                user.subscription_status === 'pro'
                  ? 'bg-gradient-to-r from-primary/20 to-red-500/20 text-primary border border-primary/30'
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}>
                {user.subscription_status === 'pro' ? (
                  <>
                    <Star className="w-3 h-3 inline mr-1" />
                    Pro
                  </>
                ) : 'Free Tier'}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Fuel Display */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-white/5 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-400">{fuelCredits.toLocaleString()}</span>
              </div>
              <Link
                href="/dashboard/fuel"
                className="text-xs text-primary hover:underline"
              >
                Get More
              </Link>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Main Navigation */}
          <div className={sidebarCollapsed ? 'px-2' : 'px-3'}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-2">
                Workspace
              </p>
            )}
            <ul className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-primary/70'}`} />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Tools */}
          <div className={sidebarCollapsed ? 'px-2' : 'px-3'}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-2">
                Tools
              </p>
            )}
            <ul className="space-y-1">
              {toolsNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-primary/70'}`} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1">{item.name}</span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Perks Card */}
          {!sidebarCollapsed && (
            <div className="px-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-red-500/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-white">Earn More Fuel</span>
                </div>
                <p className="text-xs text-white/50 mb-3">
                  Complete your profile and earn 500 bonus fuel credits!
                </p>
                <Link
                  href="/dashboard/profile"
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
                >
                  Complete Profile
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className={`border-t border-white/5 py-4 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
          <ul className="space-y-1">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              )
            })}
            <li>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-white/50 hover:text-red-400 hover:bg-red-500/10 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  title={sidebarCollapsed ? 'Sign Out' : undefined}
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">Sign Out</span>
                  )}
                </button>
              </form>
            </li>
          </ul>
        </div>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-white/5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition-all"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && (
              <span className="text-xs">Collapse</span>
            )}
          </button>
        </div>
      </aside>
    </div>
  )
}
