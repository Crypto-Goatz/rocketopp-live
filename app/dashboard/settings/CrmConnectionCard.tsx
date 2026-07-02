'use client'

/**
 * CRM connection card for /dashboard/settings.
 *
 * Read-only: verifies the RocketOpp CRM sub-location (6MSqx0trfxgLxeHBJE1k)
 * is connected and shows the live capability matrix returned by
 * GET /api/settings/crm-connection. "Re-check" re-runs the probe.
 */

import { useEffect, useState, useCallback } from 'react'
import {
  Database,
  Check,
  X,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Building2,
} from 'lucide-react'

interface Capability {
  key: string
  label: string
  ok: boolean
  status: number
}

interface CrmConnection {
  connected: boolean
  locationId: string
  locationName: string | null
  authSource: 'oauth' | 'pit'
  hasToken: boolean
  agencyAccess: boolean
  capabilities: Capability[]
}

export default function CrmConnectionCard() {
  const [data, setData] = useState<CrmConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const check = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/settings/crm-connection', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to check CRM connection')
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check CRM connection')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    check()
  }, [check])

  const okCount = data?.capabilities.filter((c) => c.ok).length ?? 0
  const total = data?.capabilities.length ?? 0

  return (
    <div className="mt-8 p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            CRM Connection
          </h2>
          <p className="text-sm text-white/50 mt-1">
            RocketOpp is powered by an agency-enabled CRM sub-location. This
            verifies the live connection and available capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {data?.connected && (
            <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
              Connected
            </span>
          )}
          {data && !data.connected && (
            <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
              Not connected
            </span>
          )}
          <button
            onClick={check}
            disabled={loading}
            aria-label="Re-check CRM connection"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Re-check
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      ) : data ? (
        <div className="space-y-5">
          {/* Location + auth summary */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                Sub-location
              </p>
              <p className="font-medium text-white">
                {data.locationName || 'RocketOpp'}
              </p>
              <p className="text-xs text-white/40 mt-1 font-mono">
                {data.locationId}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Auth:{' '}
                <span className="font-medium text-white">
                  {data.authSource === 'oauth' ? 'OAuth install' : 'Private Integration Token'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Building2 className="w-4 h-4 text-primary" />
                Agency access:{' '}
                {data.agencyAccess ? (
                  <span className="font-medium text-green-400">Enabled</span>
                ) : (
                  <span className="font-medium text-white/50">Location-only</span>
                )}
              </div>
            </div>
          </div>

          {/* Capability matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white/60">Capabilities</p>
              <p className="text-xs text-white/40">
                {okCount}/{total} available
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.capabilities.map((cap) => (
                <div
                  key={cap.key}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm ${
                    cap.ok
                      ? 'bg-white/5 border-green-500/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {cap.ok ? (
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-red-400/70 shrink-0" />
                  )}
                  <span className="truncate">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>

          {!data.hasToken && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300/90 text-sm">
              No CRM credential resolved. Set <span className="font-mono">CRM_PIT_ROCKETOPP</span>{' '}
              (or connect the OAuth app) so the site can reach this sub-location.
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
