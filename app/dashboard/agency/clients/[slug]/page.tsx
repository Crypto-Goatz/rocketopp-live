"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Building2, ArrowLeft, Globe, Zap, BarChart3, FolderKanban,
  CheckCircle, Clock, AlertTriangle, ExternalLink, Settings,
  Activity, DollarSign, Calendar, Mail, Phone, Plus, Play,
  Pause, RefreshCw, Code, Database, Server, Plug
} from "lucide-react"

interface Client {
  id: string
  name: string
  slug: string
  industry: string
  status: string
  billing_type: string
  monthly_retainer: number
  health_score: number
  last_activity_at: string
  primary_contact_name: string
  primary_contact_email: string
  primary_contact_phone: string
  website: string
  integrations: Record<string, unknown>
  notes: string
}

interface Project {
  id: string
  name: string
  description: string
  status: string
  project_type: string
  progress: number
  github_repo: string
  live_url: string
  staging_url: string
}

interface Integration {
  id: string
  integration_type: string
  name: string
  status: string
  config: Record<string, unknown>
  last_sync_at: string
  error_message: string
}

interface Task {
  id: string
  title: string
  status: string
  priority: string
  due_date: string
}

export default function ClientDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'integrations' | 'tasks'>('overview')

  useEffect(() => {
    fetchClientData()
  }, [slug])

  const fetchClientData = async () => {
    try {
      const response = await fetch(`/api/agency/clients/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setClient(data.client)
        setProjects(data.projects || [])
        setIntegrations(data.integrations || [])
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch client:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'connected': case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'paused': case 'pending': case 'in_progress': case 'review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'error': case 'blocked': case 'churned':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'ghl': return <Zap className="w-5 h-5 text-blue-400" />
      case 'mcp': return <Server className="w-5 h-5 text-purple-400" />
      case 'analytics': return <BarChart3 className="w-5 h-5 text-green-400" />
      case 'custom_api': return <Code className="w-5 h-5 text-orange-400" />
      default: return <Plug className="w-5 h-5 text-zinc-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Client Not Found</h2>
          <Link href="/dashboard/agency" className="text-orange-400 hover:underline">
            Back to Agency Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/agency"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
            <span className="text-2xl font-bold text-orange-400">{client.name.charAt(0)}</span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{client.name}</h1>
              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>
            <p className="text-white/60">{client.industry}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {client.website && (
            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg text-white/80 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit Site
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
            <Activity className="w-4 h-4" />
            Health Score
          </div>
          <div className={`text-3xl font-bold ${getHealthColor(client.health_score)}`}>
            {client.health_score}%
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Monthly Retainer
          </div>
          <div className="text-3xl font-bold text-green-400">
            ${client.monthly_retainer.toLocaleString()}
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
            <FolderKanban className="w-4 h-4" />
            Active Projects
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {projects.filter(p => p.status === 'active').length}
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
            <Plug className="w-4 h-4" />
            Integrations
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {integrations.filter(i => i.status === 'connected').length}/{integrations.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <div className="flex gap-6">
          {(['overview', 'projects', 'integrations', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Primary Contact</p>
                  <p className="text-white">{client.primary_contact_name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <a href={`mailto:${client.primary_contact_email}`} className="text-orange-400 hover:underline">
                    {client.primary_contact_email || 'Not set'}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Phone</p>
                  <p className="text-white">{client.primary_contact_phone || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <p className="text-white/80 whitespace-pre-wrap">
              {client.notes || 'No notes yet.'}
            </p>
          </div>

          {/* Recent Projects */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-sm text-orange-400 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">{project.name}</h4>
                    <p className="text-sm text-white/60">{project.project_type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-white/60">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations Overview */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Integrations</h3>
              <button
                onClick={() => setActiveTab('integrations')}
                className="text-sm text-orange-400 hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIntegrationIcon(integration.integration_type)}
                    <div>
                      <h4 className="font-medium text-white">{integration.name}</h4>
                      <p className="text-sm text-white/60">{integration.integration_type.toUpperCase()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Projects</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors">
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-white">{project.name}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-white/60 mt-1">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{project.progress}%</div>
                    <p className="text-sm text-white/60">Complete</p>
                  </div>
                </div>

                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  {project.github_repo && (
                    <a
                      href={`https://github.com/${project.github_repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-white/60 hover:text-white"
                    >
                      <Code className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-white/60 hover:text-white"
                    >
                      <Globe className="w-4 h-4" />
                      Live Site
                    </a>
                  )}
                  {project.staging_url && (
                    <a
                      href={project.staging_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-white/60 hover:text-white"
                    >
                      <Server className="w-4 h-4" />
                      Staging
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">API & MCP Integrations</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
              <Plus className="w-4 h-4" />
              Add Integration
            </button>
          </div>

          <div className="grid gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                      {getIntegrationIcon(integration.integration_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-white">{integration.name}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mt-1">
                        Type: {integration.integration_type.toUpperCase()}
                      </p>
                      {integration.last_sync_at && (
                        <p className="text-white/40 text-xs mt-1">
                          Last sync: {new Date(integration.last_sync_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Sync Now">
                      <RefreshCw className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Configure">
                      <Settings className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>

                {integration.error_message && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-400">{integration.error_message}</p>
                  </div>
                )}

                {integration.config && Object.keys(integration.config).length > 0 && (
                  <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
                    <p className="text-xs text-white/40 mb-2">Configuration:</p>
                    <pre className="text-xs text-white/60 overflow-x-auto">
                      {JSON.stringify(integration.config, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Tasks</h3>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-zinc-800">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-white/60">
                  No tasks yet. Create your first task to get started.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'completed' ? 'bg-emerald-400' :
                        task.status === 'in_progress' ? 'bg-yellow-400' :
                        'bg-zinc-600'
                      }`} />
                      <span className="text-white">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {task.due_date && (
                        <span className="text-sm text-white/60">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
