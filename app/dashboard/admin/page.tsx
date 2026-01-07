"use client"

import { useEffect, useState } from "react"
import {
  Users, BarChart3, Settings, Shield, Zap, TrendingUp,
  Activity, Eye, UserCheck, CreditCard, Flag, Database,
  RefreshCw, Search, MoreVertical, ChevronDown, Check, X,
  Fuel, Crown, AlertTriangle
} from "lucide-react"

interface AdminStats {
  total_users: number
  new_users_week: number
  new_users_month: number
  total_leads: number
  new_leads_week: number
  active_subscriptions: number
  pageviews_today: number
  visitors_today: number
}

interface User {
  id: string
  email: string
  name: string | null
  is_admin: boolean
  role: string
  fuel_credits: number
  subscription_status?: string
  created_at: string
}

interface FeatureFlag {
  name: string
  enabled: boolean
  description: string | null
  rollout_percentage: number
}

interface SiteSetting {
  key: string
  value: any
  description: string | null
  category: string
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'features' | 'settings'>('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [features, setFeatures] = useState<FeatureFlag[]>([])
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  useEffect(() => {
    if (authorized) {
      loadData()
    }
  }, [authorized, activeTab])

  async function checkAdminAccess() {
    try {
      const res = await fetch('/api/admin/check')
      if (res.ok) {
        setAuthorized(true)
      }
    } catch (error) {
      console.error('Admin check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadData() {
    setRefreshing(true)
    try {
      if (activeTab === 'overview' || activeTab === 'users') {
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/users')
        ])

        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }

        if (usersRes.ok) {
          const data = await usersRes.json()
          setUsers(data.users)
          setTotalUsers(data.total)
        }
      }

      if (activeTab === 'features') {
        const res = await fetch('/api/admin/features')
        if (res.ok) {
          const data = await res.json()
          setFeatures(data)
        }
      }

      if (activeTab === 'settings') {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  async function toggleFeature(name: string, enabled: boolean) {
    try {
      await fetch('/api/admin/features', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, enabled })
      })
      setFeatures(features.map(f => f.name === name ? { ...f, enabled } : f))
    } catch (error) {
      console.error('Failed to toggle feature:', error)
    }
  }

  async function updateUserRole(userId: string, role: string, isAdmin: boolean) {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, is_admin: isAdmin })
      })
      setUsers(users.map(u => u.id === userId ? { ...u, role, is_admin: isAdmin } : u))
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/50">You don&apos;t have permission to access this area.</p>
        </div>
      </div>
    )
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-white/50 mt-1">Manage your platform</p>
        </div>
        <button
          onClick={() => loadData()}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'features', label: 'Feature Flags', icon: Flag },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary/20 text-primary'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={stats.total_users}
              icon={Users}
              trend={`+${stats.new_users_week} this week`}
              color="blue"
            />
            <StatCard
              title="Active Subscriptions"
              value={stats.active_subscriptions}
              icon={CreditCard}
              color="green"
            />
            <StatCard
              title="Total Leads"
              value={stats.total_leads}
              icon={UserCheck}
              trend={`+${stats.new_leads_week} this week`}
              color="purple"
            />
            <StatCard
              title="Visitors Today"
              value={stats.visitors_today}
              icon={Eye}
              trend={`${stats.pageviews_today} pageviews`}
              color="orange"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Growth This Month
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">New Users</span>
                  <span className="text-white font-semibold">{stats.new_users_month}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">New Leads</span>
                  <span className="text-white font-semibold">{stats.new_leads_week}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Conversion Rate</span>
                  <span className="text-white font-semibold">
                    {stats.total_users > 0
                      ? ((stats.active_subscriptions / stats.total_users) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Real-Time Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Active Now</span>
                  <span className="text-green-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    {stats.visitors_today}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Pageviews Today</span>
                  <span className="text-white font-semibold">{stats.pageviews_today}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 border border-primary/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Platform Health
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Database</span>
                  <span className="text-green-400 font-semibold">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">API Status</span>
                  <span className="text-green-400 font-semibold">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Last Deploy</span>
                  <span className="text-white/70 text-sm">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
            <div className="space-y-3">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.name || user.email}</p>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.role === 'superadmin' && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                        <Crown className="w-3 h-3 inline mr-1" />
                        Superadmin
                      </span>
                    )}
                    <span className="text-white/40 text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Users Table */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/50 font-medium text-sm">User</th>
                  <th className="text-left p-4 text-white/50 font-medium text-sm">Role</th>
                  <th className="text-left p-4 text-white/50 font-medium text-sm">Fuel</th>
                  <th className="text-left p-4 text-white/50 font-medium text-sm">Status</th>
                  <th className="text-left p-4 text-white/50 font-medium text-sm">Joined</th>
                  <th className="text-right p-4 text-white/50 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {user.name?.[0] || user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.name || 'No name'}</p>
                          <p className="text-white/40 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value, e.target.value !== 'user')}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-primary/50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-orange-400 text-sm">
                        <Fuel className="w-4 h-4" />
                        {user.fuel_credits?.toLocaleString() || 100}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.subscription_status === 'pro'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {user.subscription_status === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="p-4 text-white/50 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-white/30 text-sm text-center">
            Showing {filteredUsers.length} of {totalUsers} users
          </p>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white/5 border border-white/10 divide-y divide-white/10">
            {features.map(feature => (
              <div key={feature.name} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{feature.name}</h4>
                  {feature.description && (
                    <p className="text-white/50 text-sm mt-1">{feature.description}</p>
                  )}
                  {feature.rollout_percentage < 100 && (
                    <p className="text-orange-400 text-xs mt-1">
                      {feature.rollout_percentage}% rollout
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleFeature(feature.name, !feature.enabled)}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    feature.enabled ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      feature.enabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {['branding', 'features', 'rewards'].map(category => {
            const categorySettings = settings.filter(s => s.category === category)
            if (categorySettings.length === 0) return null

            return (
              <div key={category} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold capitalize">{category}</h3>
                </div>
                <div className="divide-y divide-white/10">
                  {categorySettings.map(setting => (
                    <div key={setting.key} className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{setting.key}</h4>
                        {setting.description && (
                          <p className="text-white/50 text-sm">{setting.description}</p>
                        )}
                      </div>
                      <div className="text-white/70 text-sm font-mono bg-white/5 px-3 py-1 rounded">
                        {typeof setting.value === 'object'
                          ? JSON.stringify(setting.value).slice(0, 30) + '...'
                          : String(setting.value).replace(/"/g, '')
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color
}: {
  title: string
  value: number
  icon: any
  trend?: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
  }

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colors[color]} border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-sm">{title}</span>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      {trend && <p className="text-xs text-white/50 mt-1">{trend}</p>}
    </div>
  )
}
