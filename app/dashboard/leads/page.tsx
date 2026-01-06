'use client'

import { useState, useEffect } from 'react'
import {
  Users, Mail, Phone, Building2, Globe, Calendar,
  Filter, Search, ChevronDown, MoreHorizontal,
  CheckCircle, Clock, UserCheck, Star, RefreshCw,
  MapPin, Smartphone, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Lead {
  id: string
  visitor_id: string
  email: string | null
  phone: string | null
  name: string | null
  company: string | null
  source: string
  page: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  device_type: string | null
  browser: string | null
  country: string | null
  city: string | null
  status: string
  notes: string | null
  created_at: string
}

interface LeadsData {
  leads: Lead[]
  total: number
  sources: string[]
  statusBreakdown: {
    new: number
    contacted: number
    qualified: number
    converted: number
  }
}

export default function LeadsDashboard() {
  const [data, setData] = useState<LeadsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [statusFilter, sourceFilter])

  async function fetchLeads() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (sourceFilter) params.set('source', sourceFilter)

      const res = await fetch(`/api/analytics/leads?${params}`)
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    }
    setLoading(false)
  }

  async function updateLeadStatus(id: string, status: string) {
    try {
      await fetch('/api/analytics/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      fetchLeads()
    } catch (error) {
      console.error('Failed to update lead:', error)
    }
  }

  const filteredLeads = data?.leads.filter(lead => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      lead.email?.toLowerCase().includes(query) ||
      lead.name?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query)
    )
  }) || []

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    qualified: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    converted: 'bg-green-500/20 text-green-400 border-green-500/30',
  }

  const statusIcons: Record<string, React.ElementType> = {
    new: Star,
    contacted: Clock,
    qualified: UserCheck,
    converted: CheckCircle,
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Lead Management
          </h1>
          <p className="text-white/50">
            Track and manage your incoming leads
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLeads}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatusCard
          icon={Star}
          label="New"
          value={data?.statusBreakdown.new || 0}
          color="blue"
          onClick={() => setStatusFilter(statusFilter === 'new' ? '' : 'new')}
          active={statusFilter === 'new'}
        />
        <StatusCard
          icon={Clock}
          label="Contacted"
          value={data?.statusBreakdown.contacted || 0}
          color="yellow"
          onClick={() => setStatusFilter(statusFilter === 'contacted' ? '' : 'contacted')}
          active={statusFilter === 'contacted'}
        />
        <StatusCard
          icon={UserCheck}
          label="Qualified"
          value={data?.statusBreakdown.qualified || 0}
          color="purple"
          onClick={() => setStatusFilter(statusFilter === 'qualified' ? '' : 'qualified')}
          active={statusFilter === 'qualified'}
        />
        <StatusCard
          icon={CheckCircle}
          label="Converted"
          value={data?.statusBreakdown.converted || 0}
          color="green"
          onClick={() => setStatusFilter(statusFilter === 'converted' ? '' : 'converted')}
          active={statusFilter === 'converted'}
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900/50 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-zinc-900/50 border border-white/10 text-white appearance-none cursor-pointer focus:border-primary/50 focus:outline-none"
          >
            <option value="">All Sources</option>
            {data?.sources.map((source) => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-white/40 uppercase px-6 py-4">Contact</th>
                <th className="text-left text-xs font-medium text-white/40 uppercase px-6 py-4">Source</th>
                <th className="text-left text-xs font-medium text-white/40 uppercase px-6 py-4">Location</th>
                <th className="text-left text-xs font-medium text-white/40 uppercase px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-white/40 uppercase px-6 py-4">Date</th>
                <th className="text-right text-xs font-medium text-white/40 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-12 bg-white/5 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No leads found</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const StatusIcon = statusIcons[lead.status] || Star
                  return (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {lead.name?.[0] || lead.email?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {lead.name || 'Unknown'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              {lead.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </span>
                              )}
                            </div>
                            {lead.company && (
                              <div className="flex items-center gap-1 text-xs text-white/30 mt-0.5">
                                <Building2 className="w-3 h-3" />
                                {lead.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white capitalize">{lead.source}</p>
                          {lead.utm_campaign && (
                            <p className="text-xs text-white/40">{lead.utm_campaign}</p>
                          )}
                          {lead.page && (
                            <p className="text-xs text-white/30 truncate max-w-[150px]">{lead.page}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MapPin className="w-3 h-3" />
                          {lead.city && lead.country
                            ? `${lead.city}, ${lead.country}`
                            : lead.country || 'Unknown'}
                        </div>
                        {lead.device_type && (
                          <div className="flex items-center gap-1 text-xs text-white/30 mt-1">
                            <Smartphone className="w-3 h-3" />
                            {lead.device_type} • {lead.browser}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer ${statusColors[lead.status]}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white/60">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-white/30">
                          {new Date(lead.created_at).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-white/40" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {data && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-white/40">
              Showing {filteredLeads.length} of {data.total} leads
            </p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Lead Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {selectedLead.name && (
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Name</p>
                  <p className="text-white">{selectedLead.name}</p>
                </div>
              )}
              {selectedLead.email && (
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
              )}
              {selectedLead.phone && (
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Phone</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-primary hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
              )}
              {selectedLead.company && (
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Company</p>
                  <p className="text-white">{selectedLead.company}</p>
                </div>
              )}

              <hr className="border-white/10" />

              <div>
                <p className="text-xs text-white/40 uppercase mb-1">Source</p>
                <p className="text-white capitalize">{selectedLead.source}</p>
                {selectedLead.utm_source && (
                  <p className="text-xs text-white/40 mt-1">
                    {selectedLead.utm_source} / {selectedLead.utm_medium}
                    {selectedLead.utm_campaign && ` / ${selectedLead.utm_campaign}`}
                  </p>
                )}
              </div>

              {selectedLead.page && (
                <div>
                  <p className="text-xs text-white/40 uppercase mb-1">Landing Page</p>
                  <p className="text-white text-sm">{selectedLead.page}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-white/40 uppercase mb-1">Location & Device</p>
                <p className="text-white text-sm">
                  {selectedLead.city && selectedLead.country
                    ? `${selectedLead.city}, ${selectedLead.country}`
                    : selectedLead.country || 'Unknown'}
                </p>
                <p className="text-xs text-white/40">
                  {selectedLead.device_type} • {selectedLead.browser}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40 uppercase mb-1">Captured</p>
                <p className="text-white">
                  {new Date(selectedLead.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {selectedLead.email && (
                <Button size="sm" className="flex-1" asChild>
                  <a href={`mailto:${selectedLead.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              )}
              {selectedLead.phone && (
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <a href={`tel:${selectedLead.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Status Card Component
function StatusCard({
  icon: Icon,
  label,
  value,
  color,
  onClick,
  active,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
  onClick: () => void
  active: boolean
}) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-yellow-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
  }

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all text-left ${
        active
          ? 'bg-white/10 border-primary/50'
          : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} bg-opacity-20 flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40">{label}</p>
    </button>
  )
}
