"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FolderKanban, Plus, Search, Filter, ArrowUpRight,
  Globe, Code, Server, CheckCircle, Clock, AlertTriangle,
  Building2, ExternalLink
} from "lucide-react"

interface Project {
  id: string
  client_id: string
  client_name: string
  client_slug: string
  name: string
  description: string
  status: string
  project_type: string
  progress: number
  github_repo: string
  live_url: string
  due_date: string
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/agency/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      // Use mock data
      setProjects(getMockProjects())
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'on_hold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="w-4 h-4" />
      case 'app': return <Code className="w-4 h-4" />
      case 'automation': return <Server className="w-4 h-4" />
      default: return <FolderKanban className="w-4 h-4" />
    }
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
            <FolderKanban className="w-7 h-7 text-purple-400" />
            Projects
          </h1>
          <p className="text-white/60 mt-1">Track all client projects and deliverables</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
          <option value="planning">Planning</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
            <FolderKanban className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">
              {searchQuery || statusFilter !== 'all'
                ? 'No projects match your filters'
                : 'No projects yet. Create your first project to get started.'}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      {getTypeIcon(project.project_type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {project.name}
                      </h3>
                      <Link
                        href={`/dashboard/agency/clients/${project.client_slug}`}
                        className="text-sm text-white/60 hover:text-orange-400 flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3" />
                        {project.client_name}
                      </Link>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-4">{project.description}</p>

                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-white/40 capitalize">{project.project_type}</span>
                    {project.github_repo && (
                      <a
                        href={`https://github.com/${project.github_repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/60 hover:text-white flex items-center gap-1"
                      >
                        <Code className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/60 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-white">{project.progress}%</div>
                  <p className="text-xs text-white/40">Progress</p>
                  <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function getMockProjects(): Project[] {
  return [
    {
      id: 'p1',
      client_id: '1',
      client_name: 'RocketOpp',
      client_slug: 'rocketopp',
      name: 'RocketOpp.com Website',
      description: 'Main agency website with AI assessment, lead capture, and client dashboard',
      status: 'active',
      project_type: 'website',
      progress: 85,
      github_repo: 'Crypto-Goatz/rocketopp-live',
      live_url: 'https://rocketopp.com',
      due_date: ''
    },
    {
      id: 'p2',
      client_id: '1',
      client_name: 'RocketOpp',
      client_slug: 'rocketopp',
      name: 'Rocket+ (GHL Marketplace App)',
      description: 'GoHighLevel marketplace app with RocketFlow, AI tools, and automation',
      status: 'active',
      project_type: 'app',
      progress: 90,
      github_repo: 'Crypto-Goatz/rocket-mods',
      live_url: 'https://rocketadd.com',
      due_date: ''
    },
    {
      id: 'p3',
      client_id: '1',
      client_name: 'RocketOpp',
      client_slug: 'rocketopp',
      name: 'Spark AI Assessment',
      description: 'Interactive AI-powered business assessment with lead capture',
      status: 'active',
      project_type: 'automation',
      progress: 95,
      github_repo: '',
      live_url: 'https://rocketopp.com/assessment',
      due_date: ''
    },
    {
      id: 'p4',
      client_id: '2',
      client_name: 'ABK Unlimited',
      client_slug: 'abk-unlimited',
      name: 'ABK Website',
      description: 'Full-service contractor website with lead capture, portfolio, and AI visualizer',
      status: 'completed',
      project_type: 'website',
      progress: 100,
      github_repo: 'Crypto-Goatz/ABK-Unlimited',
      live_url: 'https://abkunlimited.com',
      due_date: ''
    },
    {
      id: 'p5',
      client_id: '2',
      client_name: 'ABK Unlimited',
      client_slug: 'abk-unlimited',
      name: 'SEO & Local Marketing',
      description: 'Ongoing SEO optimization and local search presence',
      status: 'active',
      project_type: 'seo',
      progress: 60,
      github_repo: '',
      live_url: '',
      due_date: ''
    }
  ]
}
