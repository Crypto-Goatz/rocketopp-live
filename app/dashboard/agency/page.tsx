"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Building2, Users, FolderKanban, Activity, TrendingUp, DollarSign,
  CheckCircle, Clock, AlertTriangle, ArrowUpRight, Zap, Globe,
  BarChart3, Settings, Plus, Search, Filter, MoreVertical
} from "lucide-react"

interface Client {
  id: string
  name: string
  slug: string
  industry: string
  status: string
  health_score: number
  monthly_retainer: number
  last_activity_at: string
  integrations: Record<string, unknown>
  projects_count?: number
  tasks_pending?: number
}

interface AgencyStats {
  total_clients: number
  active_clients: number
  total_mrr: number
  avg_health_score: number
  projects_active: number
  tasks_pending: number
}

export default function AgencyDashboard() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState<AgencyStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAgencyData()
  }, [])

  const fetchAgencyData = async () => {
    try {
      const response = await fetch('/api/agency/dashboard')
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Failed to fetch agency data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'churned': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'prospect': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(cents)
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-orange-400" />
            Agency Command Center
          </h1>
          <p className="text-white/60 mt-1">Manage clients, projects, and integrations</p>
        </div>
        <Link
          href="/dashboard/agency/clients/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <Users className="w-4 h-4" />
            Total Clients
          </div>
          <div className="text-2xl font-bold text-white">{stats?.total_clients || 0}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Active
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats?.active_clients || 0}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            Monthly MRR
          </div>
          <div className="text-2xl font-bold text-green-400">{formatCurrency(stats?.total_mrr || 0)}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Avg Health
          </div>
          <div className={`text-2xl font-bold ${getHealthColor(stats?.avg_health_score || 0)}`}>
            {stats?.avg_health_score || 0}%
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <FolderKanban className="w-4 h-4 text-purple-400" />
            Active Projects
          </div>
          <div className="text-2xl font-bold text-purple-400">{stats?.projects_active || 0}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Pending Tasks
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats?.tasks_pending || 0}</div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Clients</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm w-64 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-800">
          {filteredClients.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              {searchQuery ? 'No clients match your search' : 'No clients yet. Add your first client to get started.'}
            </div>
          ) : (
            filteredClients.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/agency/clients/${client.slug}`}
                className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Client Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
                    <span className="text-lg font-bold text-orange-400">
                      {client.name.charAt(0)}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {client.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{client.industry}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Integrations */}
                  <div className="flex items-center gap-1">
                    {client.integrations?.ghl && (
                      <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center" title="GHL Connected">
                        <Zap className="w-3 h-3 text-blue-400" />
                      </div>
                    )}
                    {client.integrations?.mcp && (
                      <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center" title="MCP Connected">
                        <Globe className="w-3 h-3 text-purple-400" />
                      </div>
                    )}
                    {client.integrations?.analytics && (
                      <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center" title="Analytics Connected">
                        <BarChart3 className="w-3 h-3 text-green-400" />
                      </div>
                    )}
                  </div>

                  {/* Health Score */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getHealthColor(client.health_score)}`}>
                      {client.health_score}%
                    </div>
                    <div className="text-xs text-white/40">Health</div>
                  </div>

                  {/* Retainer */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(client.monthly_retainer)}
                    </div>
                    <div className="text-xs text-white/40">/month</div>
                  </div>

                  {/* Last Activity */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-sm text-white/60">
                      {timeAgo(client.last_activity_at)}
                    </div>
                    <div className="text-xs text-white/40">Last active</div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-orange-400 transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/agency/clients"
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-orange-500/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                Manage Clients
              </h3>
              <p className="text-sm text-white/60">View all clients and details</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/projects"
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-purple-500/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                All Projects
              </h3>
              <p className="text-sm text-white/60">Track project progress</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/agency/integrations"
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-blue-500/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                Integrations
              </h3>
              <p className="text-sm text-white/60">API & MCP connections</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
