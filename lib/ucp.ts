/**
 * UCP (Universal Capability Protocol) client.
 *
 * Talks to the 0nCore dispatch service at 0ncore.com. Used to render
 * cross-ecosystem signals on rocketopp.com (live activity, rules digest,
 * product status, ecosystem registry) without each page needing to know
 * the dispatch contract.
 *
 * Caching: every call uses Next.js fetch with `next.revalidate = 300` so
 * we get one upstream call per 5 minutes per route segment. UCP is a slow-
 * moving feed; aggressive caching is fine.
 */

const UCP_BASE = process.env.UCP_BASE_URL ?? 'https://www.0ncore.com/api/dispatch'
const REVALIDATE_SECONDS = 300

export interface UcpVersion {
  sha: string
  author_github_user: string
  message: string
  committed_at: string
  pushed_at: string
}

export interface UcpRule {
  number: number
  category: string
  short_form: string
  long_form_md: string
  memory_pointer?: string
  active: boolean
  source_sha: string
  updated_at: string
}

export interface UcpEcosystemEntry {
  kind: 'repo' | 'product' | 'service' | 'tool' | string
  slug: string
  display_name: string
  meta: {
    db_ref?: string
    domain?: string
    github?: string
    [k: string]: unknown
  }
  used_by: string[]
  source_sha: string
  updated_at: string
}

export interface UcpProduct {
  slug: string
  display_name: string
  domain?: string
  version?: string
  is_live: boolean
  mode?: string
  status_md?: string
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${UCP_BASE}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: 'application/json' },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function getUcpVersion(): Promise<UcpVersion | null> {
  return get<UcpVersion>('/version')
}

export async function getUcpRules(): Promise<UcpRule[]> {
  const out = await get<{ rules: UcpRule[] }>('/rules')
  return out?.rules ?? []
}

export async function getUcpEcosystem(): Promise<UcpEcosystemEntry[]> {
  const out = await get<{ entries: UcpEcosystemEntry[] }>('/ecosystem')
  return out?.entries ?? []
}

export async function getUcpProduct(slug: string): Promise<UcpProduct | null> {
  return get<UcpProduct>(`/products/${slug}`)
}

/**
 * Composite snapshot used by every page that wants the full UCP picture.
 * Single Promise.all so layouts don't serialize four upstream round-trips.
 */
export async function getUcpSnapshot(): Promise<{
  version: UcpVersion | null
  rules_count: number
  active_rules_count: number
  live_products: UcpProduct[]
  ecosystem_count: number
}> {
  const [version, rules, ecosystem] = await Promise.all([
    getUcpVersion(),
    getUcpRules(),
    getUcpEcosystem(),
  ])

  // Pull a few flagship product statuses in parallel — these are the most
  // marketing-valuable signals to surface on rocketopp.com.
  const flagships = ['onork-app', 'sxowebsite', 'rocketclients', 'rocketadd', 'rocketpost']
  const products = await Promise.all(
    flagships.map((slug) => getUcpProduct(slug).catch(() => null)),
  )
  const live_products = products.filter(
    (p): p is UcpProduct => p !== null && p.is_live === true,
  )

  return {
    version,
    rules_count: rules.length,
    active_rules_count: rules.filter((r) => r.active).length,
    live_products,
    ecosystem_count: ecosystem.length,
  }
}

/**
 * Format a UTC timestamp into a relative-time string for the live strip
 * (e.g. "12 min ago"). Server-rendered, deterministic by the build cache.
 */
export function relativeFrom(iso: string, now: Date = new Date()): string {
  const ts = new Date(iso).getTime()
  const diff = Math.max(0, now.getTime() - ts)
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
