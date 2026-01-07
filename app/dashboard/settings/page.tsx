"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Settings, Link2, Unlink, Check, X, Loader2,
  BarChart3, Search, DollarSign, Calendar,
  ExternalLink, Shield, AlertCircle
} from "lucide-react"

interface GoogleConnection {
  id: string
  services: string[]
  connected_at: string
  status: string
  ga4_property_id: string | null
  search_console_site: string | null
}

const GOOGLE_SERVICES = [
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'View website traffic and user behavior data',
    icon: BarChart3,
    color: 'from-orange-500/20 to-yellow-500/20 text-orange-400',
  },
  {
    id: 'search_console',
    name: 'Search Console',
    description: 'Monitor search rankings and indexing status',
    icon: Search,
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
  },
  {
    id: 'ads',
    name: 'Google Ads',
    description: 'Manage ad campaigns and track performance',
    icon: DollarSign,
    color: 'from-green-500/20 to-emerald-500/20 text-green-400',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Sync events and schedule meetings',
    icon: Calendar,
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400',
  },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [connection, setConnection] = useState<GoogleConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>(['analytics', 'search_console'])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchConnection()

    // Check for success/error from OAuth callback
    if (searchParams.get('connected') === 'true') {
      setSuccessMessage('Google account connected successfully!')
      setTimeout(() => setSuccessMessage(null), 5000)
    }
    if (searchParams.get('error')) {
      setErrorMessage('Failed to connect Google account. Please try again.')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }, [searchParams])

  const fetchConnection = async () => {
    try {
      const res = await fetch('/api/settings/google-connection')
      const data = await res.json()
      if (data.connection) {
        setConnection(data.connection)
      }
    } catch (err) {
      console.error('Failed to fetch connection:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    const services = selectedServices.join(',')
    window.location.href = `/api/auth/google/connect?services=${services}`
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Google account?')) return

    setDisconnecting(true)
    try {
      const res = await fetch('/api/settings/google-connection', {
        method: 'DELETE',
      })
      if (res.ok) {
        setConnection(null)
        setSuccessMessage('Google account disconnected')
        setTimeout(() => setSuccessMessage(null), 5000)
      }
    } catch (err) {
      console.error('Failed to disconnect:', err)
    } finally {
      setDisconnecting(false)
    }
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    )
  }

  const isServiceConnected = (serviceId: string) => {
    return connection?.services?.includes(serviceId) || false
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-white/60">
          Manage your account settings and connected services
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Google Connections */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Google Services
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Connect your Google account to access analytics and SEO data
            </p>
          </div>

          {connection && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                Connected
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : connection ? (
          /* Connected State */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {GOOGLE_SERVICES.map(service => (
                <div
                  key={service.id}
                  className={`p-4 rounded-xl border ${
                    isServiceConnected(service.id)
                      ? 'bg-white/5 border-green-500/30'
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{service.name}</span>
                        {isServiceConnected(service.id) && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-white/50">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-white/40 mb-4">
                Connected on {new Date(connection.connected_at).toLocaleDateString()}
              </p>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
              >
                {disconnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Unlink className="w-4 h-4" />
                )}
                Disconnect Google Account
              </button>
            </div>
          </div>
        ) : (
          /* Not Connected State */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-red-500/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">Secure Connection</p>
                  <p className="text-xs text-white/60">
                    We only request read-only access to your data. Your credentials are encrypted and never shared.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-white/60">Select the services you want to connect:</p>

            <div className="grid grid-cols-2 gap-4">
              {GOOGLE_SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedServices.includes(service.id)
                      ? 'bg-primary/10 border-2 border-primary/50'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{service.name}</span>
                        {selectedServices.includes(service.id) && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-white/50">{service.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConnect}
              disabled={selectedServices.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Connect with Google
            </button>
          </div>
        )}
      </div>

      {/* Other Settings Sections */}
      <div className="mt-8 p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">More Settings Coming Soon</h2>
        <div className="grid gap-4 text-sm text-white/50">
          <p>• Notification preferences</p>
          <p>• API keys management</p>
          <p>• Billing and subscription</p>
          <p>• Account security</p>
        </div>
      </div>
    </div>
  )
}
