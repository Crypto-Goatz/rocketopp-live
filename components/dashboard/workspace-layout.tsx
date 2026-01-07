"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Rocket, Home, Building2, User,
  Settings, LogOut, HelpCircle, ChevronRight, ChevronLeft,
  Star, BarChart3, FileText, Users, Shield,
  Briefcase, Calendar, MessageSquare, FolderOpen
} from "lucide-react"
import { useState } from "react"
import { AIChat } from "./ai-chat"

interface WorkspaceLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    email: string
    name: string | null
    fuel_credits?: number
    subscription_status?: string
    is_admin?: boolean
    role?: string
  }
  companyProfile?: {
    name?: string
    logo?: string
  } | null
}

const mainNavItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "My Business", href: "/dashboard/company", icon: Building2 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

const clientNavItems = [
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
]

const bottomNavItems = [
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const adminNavItem = { name: "Admin", href: "/dashboard/admin", icon: Shield }

export function WorkspaceLayout({ children, user, companyProfile }: WorkspaceLayoutProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isAdmin = user.is_admin || user.role === 'admin' || user.role === 'superadmin'

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r border-white/5 bg-zinc-950/80 backdrop-blur-xl flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className={`p-4 border-b border-white/5 ${sidebarCollapsed ? 'px-2' : ''}`}>
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-lg font-bold text-white">RocketOpp</span>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Client Portal</p>
              </div>
            )}
          </Link>
        </div>

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

          {/* Status Badge */}
          {!sidebarCollapsed && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-red-500/20 text-primary border border-primary/30">
                <Star className="w-3 h-3 inline mr-1" />
                Active Client
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Main Navigation */}
          <div className={sidebarCollapsed ? 'px-2' : 'px-3'}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-2">
                Account
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

          {/* Client Services */}
          <div className={sidebarCollapsed ? 'px-2' : 'px-3'}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-2">
                Services
              </p>
            )}
            <ul className="space-y-1">
              {clientNavItems.map((item) => {
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
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Card */}
          {!sidebarCollapsed && (
            <div className="px-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-red-500/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-white">Your Account Manager</span>
                </div>
                <p className="text-xs text-white/50 mb-3">
                  Need help? Your dedicated support is just a click away.
                </p>
                <Link
                  href="/dashboard/support"
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
                >
                  Contact Support
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Admin Link (only for admins) */}
        {isAdmin && (
          <div className={`border-t border-white/5 py-4 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            <Link
              href={adminNavItem.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                pathname.startsWith('/dashboard/admin')
                  ? 'bg-gradient-to-r from-primary/20 to-red-500/20 text-white border border-primary/30'
                  : 'text-primary/80 hover:text-primary hover:bg-primary/10'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={sidebarCollapsed ? adminNavItem.name : undefined}
            >
              <adminNavItem.icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{adminNavItem.name}</span>
              )}
            </Link>
          </div>
        )}

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
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {children}
      </main>

      {/* AI Chat Widget */}
      <AIChat userId={user.id} initialFuel={user.fuel_credits || 100} />
    </div>
  )
}
