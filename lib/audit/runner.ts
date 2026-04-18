/**
 * CRO9 Stack Health Audit — Node/TypeScript implementation
 * Ports phases 1-7 of the external-recon methodology to pure
 * serverless-safe Node (dns.promises + tls + fetch). No shell.
 *
 * Runtime budget target: ~30-55s on Vercel Pro (maxDuration=60).
 */

import dns from 'node:dns/promises'
import tls from 'node:tls'
import type {
  AuditReport,
  CertInfo,
  Finding,
  Host,
  TestCategory,
} from './types'

const UA = 'CRO9-Audit/1.0 (+https://rocketopp.com)'
const TIMEOUT_MS = 6000

// ---------- small helpers ----------

async function fetchHead(
  url: string,
  init: RequestInit = {}
): Promise<Response | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': UA, ...(init.headers || {}) },
      signal: ctrl.signal,
    })
    return res
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

async function fetchText(url: string, max = 200_000): Promise<{
  status: number
  headers: Headers
  body: string
  finalUrl: string
} | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': UA },
      signal: ctrl.signal,
    })
    const reader = res.body?.getReader()
    if (!reader) return { status: res.status, headers: res.headers, body: '', finalUrl: res.url }
    const chunks: Uint8Array[] = []
    let total = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      total += value.byteLength
      if (total >= max) { try { await reader.cancel() } catch {}; break }
    }
    const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)))
    return { status: res.status, headers: res.headers, body: buf.toString('utf8'), finalUrl: res.url }
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

async function runPool<T, R>(items: T[], concurrency: number, worker: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []
  let i = 0
  const run = async () => {
    while (i < items.length) {
      const mine = i++
      out[mine] = await worker(items[mine])
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run))
  return out
}

// ---------- Phase 1: DNS + subdomain sweep ----------

const COMMON_SUBS = [
  'www','mail','api','admin','app','portal','staging','stag','dev','test',
  'cdn','assets','accounts','auth','login','my','client','clients','secure',
  'files','media','static','img','images','cms','blog','shop','store',
]

async function resolveHost(name: string): Promise<string | null> {
  try {
    const r = await dns.resolve4(name)
    return r[0] || null
  } catch {
    try {
      const r = await dns.resolve6(name)
      return r[0] || null
    } catch {
      return null
    }
  }
}

async function phase1Infrastructure(apex: string, primary: string): Promise<Host[]> {
  const candidates = new Set<string>([primary, apex, ...COMMON_SUBS.map((s) => `${s}.${apex}`)])

  // Add subdomains from crt.sh (CT logs) — best-effort, 3s timeout
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 4000)
    const r = await fetch(`https://crt.sh/?q=${encodeURIComponent('%.' + apex)}&output=json`, {
      headers: { 'User-Agent': UA },
      signal: ctrl.signal,
    })
    clearTimeout(t)
    if (r.ok) {
      const data = (await r.json()) as Array<{ name_value?: string }>
      for (const row of data.slice(0, 400)) {
        for (const n of (row.name_value || '').split('\n')) {
          const name = n.trim().toLowerCase()
          if (name && !name.startsWith('*') && name.endsWith(apex)) candidates.add(name)
        }
      }
    }
  } catch {}

  const hosts: Host[] = []
  await runPool(Array.from(candidates), 16, async (name) => {
    const ip = await resolveHost(name)
    if (ip) hosts.push({ name, ip })
  })
  // Dedupe by name
  const byName = new Map<string, Host>()
  for (const h of hosts) byName.set(h.name, h)
  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 40)
}

// ---------- Phase 2: TLS posture (live host cert only — simplified) ----------

function inspectCert(hostname: string): Promise<CertInfo> {
  return new Promise((resolve) => {
    const socket = tls.connect({
      host: hostname,
      port: 443,
      servername: hostname,
      rejectUnauthorized: false,
      timeout: 5000,
    }, () => {
      const cert = socket.getPeerCertificate()
      const now = Date.now()
      const validTo = cert.valid_to ? new Date(cert.valid_to).getTime() : 0
      const daysRemaining = validTo ? Math.round((validTo - now) / 86_400_000) : undefined
      resolve({
        hostname,
        valid: socket.authorized,
        issuer: cert.issuer ? Object.entries(cert.issuer).map(([k, v]) => `${k}=${v}`).join(', ') : undefined,
        subject: cert.subject ? Object.entries(cert.subject).map(([k, v]) => `${k}=${v}`).join(', ') : undefined,
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        daysRemaining,
      })
      socket.end()
    })
    socket.on('error', (err) => resolve({ hostname, valid: false, error: err.message }))
    socket.on('timeout', () => { socket.destroy(); resolve({ hostname, valid: false, error: 'timeout' }) })
  })
}

async function phase2Tls(hosts: Host[]): Promise<CertInfo[]> {
  const targets = hosts.slice(0, 10).map((h) => h.name)
  return runPool(targets, 5, inspectCert)
}

// ---------- Phase 3: Headers + CORS + cookies ----------

const SEC_HEADERS = [
  'strict-transport-security',
  'content-security-policy',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-embedder-policy',
  'cross-origin-resource-policy',
]

interface Phase3Out {
  headers: Record<string, string>
  missingSecurityHeaders: string[]
  cookieIssues: string[]
  corsIssues: string[]
  versionDisclosed: string | null
}

async function phase3Headers(url: string): Promise<Phase3Out> {
  const res = await fetchHead(url)
  const out: Phase3Out = {
    headers: {},
    missingSecurityHeaders: [],
    cookieIssues: [],
    corsIssues: [],
    versionDisclosed: null,
  }
  if (!res) return out
  res.headers.forEach((v, k) => (out.headers[k.toLowerCase()] = v))

  for (const h of SEC_HEADERS) if (!out.headers[h]) out.missingSecurityHeaders.push(h)

  const server = out.headers['server'] || ''
  const powered = out.headers['x-powered-by'] || ''
  const banner = `${server} ${powered}`.trim()
  if (/\d+\.\d+/.test(banner)) out.versionDisclosed = banner

  const cookies = res.headers.getSetCookie?.() || []
  for (const c of cookies) {
    const low = c.toLowerCase()
    if (/session|sid|auth|token/.test(low.split('=')[0] || '')) {
      if (!/;\s*secure/.test(low)) out.cookieIssues.push(`cookie "${low.split('=')[0]}" missing Secure`)
      if (!/;\s*httponly/.test(low)) out.cookieIssues.push(`cookie "${low.split('=')[0]}" missing HttpOnly`)
      if (!/;\s*samesite/.test(low)) out.cookieIssues.push(`cookie "${low.split('=')[0]}" missing SameSite`)
    }
  }

  // Quick CORS preflight
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    const pre = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'User-Agent': UA,
        Origin: 'https://evil.example.com',
        'Access-Control-Request-Method': 'GET',
      },
      signal: ctrl.signal,
    })
    clearTimeout(t)
    const acao = pre.headers.get('access-control-allow-origin') || ''
    const acac = pre.headers.get('access-control-allow-credentials') || ''
    if (acao === '*' && acac.toLowerCase() === 'true') {
      out.corsIssues.push('wildcard Access-Control-Allow-Origin with Allow-Credentials:true (misconfigured)')
    } else if (acao === 'https://evil.example.com') {
      out.corsIssues.push('CORS reflects arbitrary Origin — validates no allowlist')
    }
  } catch {}

  return out
}

// ---------- Phase 4: Stack fingerprint ----------

interface StackFingerprint {
  platform?: string
  server?: string
  runtime?: string
  framework?: string
  frontend?: string
  signals: string[]
}

function fingerprintStack(headers: Record<string, string>, html: string): StackFingerprint {
  const s: StackFingerprint = { signals: [] }
  const hdr = (k: string) => headers[k.toLowerCase()] || ''
  const lowHtml = html.slice(0, 20_000).toLowerCase()

  if (hdr('server')) s.server = hdr('server')
  if (hdr('x-powered-by')) s.runtime = hdr('x-powered-by')
  if (hdr('cf-ray')) s.signals.push('Cloudflare')
  if (hdr('x-vercel-id') || /vercel/i.test(hdr('server'))) s.platform = 'Vercel'
  if (hdr('x-amz-cf-id') || /cloudfront/i.test(hdr('via'))) s.signals.push('CloudFront')
  if (hdr('x-github-request-id')) s.platform = 'GitHub Pages'
  if (hdr('x-netlify-request-id')) s.platform = 'Netlify'
  if (hdr('x-render-origin-server')) s.platform = 'Render'
  if (hdr('x-drupal-cache')) s.framework = 'Drupal'
  if (hdr('x-generator')) s.signals.push(`X-Generator: ${hdr('x-generator')}`)

  const cookies = hdr('set-cookie').toLowerCase()
  if (/laravel_session|xsrf-token/.test(cookies)) s.framework = s.framework || 'Laravel'
  if (/phpsessid/.test(cookies)) s.runtime = s.runtime || 'PHP'
  if (/ci_session/.test(cookies)) s.framework = s.framework || 'CodeIgniter'
  if (/connect\.sid/.test(cookies)) s.framework = s.framework || 'Express/connect'
  if (/sessionid.*csrftoken|csrftoken.*sessionid/.test(cookies)) s.framework = s.framework || 'Django'

  if (/_next\/static/.test(lowHtml)) s.frontend = 'Next.js'
  else if (/\/build\/assets\/.*vite|@vite\//.test(lowHtml)) s.frontend = 'Vite'
  else if (/livewire\/livewire\.js/.test(lowHtml)) s.frontend = 'Laravel Livewire'
  else if (/ng-version=|angular\./.test(lowHtml)) s.frontend = 'Angular'
  else if (/__nuxt__|nuxt-/.test(lowHtml)) s.frontend = 'Nuxt'
  else if (/data-react|react-dom|_app\/immutable/.test(lowHtml)) s.frontend = 'React'
  else if (/vuejs|vue\./.test(lowHtml)) s.frontend = 'Vue'
  else if (/wp-content|wp-includes/.test(lowHtml)) s.framework = s.framework || 'WordPress'

  const metaGen = lowHtml.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i)
  if (metaGen) s.signals.push(`generator meta: ${metaGen[1]}`)

  return s
}

// ---------- Phase 5: Attack surface enumeration ----------

const SENSITIVE_PATHS = [
  '/.env', '/.env.backup', '/.env.production',
  '/.git/config', '/.git/HEAD', '/.DS_Store', '/.htaccess',
  '/phpinfo.php', '/info.php', '/test.php',
  '/_debugbar/open', '/_ignition/health-check', '/telescope', '/horizon',
  '/storage/logs/laravel.log',
  '/robots.txt', '/sitemap.xml',
  '/composer.json', '/composer.lock', '/package.json', '/package-lock.json',
  '/readme.md', '/README.md', '/CHANGELOG.md',
  '/backup.zip', '/backup.sql', '/backup.tar.gz', '/db.sql', '/dump.sql',
  '/admin', '/administrator', '/wp-admin', '/wp-login.php',
  '/phpmyadmin', '/adminer', '/adminer.php',
  '/install', '/installer', '/setup.php',
  '/register', '/signup',
  '/api', '/api/v1',
  '/sanctum/csrf-cookie',
  '/mix-manifest.json',
]

async function phase5Paths(origin: string): Promise<Array<{ path: string; status: number; size: number }>> {
  const out: Array<{ path: string; status: number; size: number }> = []
  await runPool(SENSITIVE_PATHS, 8, async (p) => {
    const res = await fetchHead(origin + p)
    if (!res) return
    if (res.status !== 404 && res.status !== 0) {
      // Estimate size from content-length if present
      const len = Number(res.headers.get('content-length') || 0)
      out.push({ path: p, status: res.status, size: len })
    }
  })
  return out.sort((a, b) => a.path.localeCompare(b.path))
}

// ---------- Phase 7: Asset age ----------

const ASSET_PATHS = [
  '/favicon.ico', '/css/app.css', '/js/app.js',
  '/assets/css/style.css', '/assets/js/template.js',
  '/assets/vendors/js/vendor.bundle.base.js',
  '/img/logo.png',
]

async function phase7Assets(origin: string): Promise<Array<{ path: string; lastModified?: string; ageDays?: number }>> {
  const out: Array<{ path: string; lastModified?: string; ageDays?: number }> = []
  await runPool(ASSET_PATHS, 4, async (p) => {
    const res = await fetchHead(origin + p)
    if (!res || res.status === 404) return
    const lm = res.headers.get('last-modified') || undefined
    const ageDays = lm ? Math.round((Date.now() - new Date(lm).getTime()) / 86_400_000) : undefined
    out.push({ path: p, lastModified: lm, ageDays })
  })
  return out
}

// ---------- Scoring ----------

function dedupeFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>()
  const out: Finding[] = []
  for (const f of findings) {
    const k = `${f.severity}::${f.title}`
    if (!seen.has(k)) { seen.add(k); out.push(f) }
  }
  return out
}

function scoreAudit(findings: Finding[]): { score: number; grade: AuditReport['grade'] } {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, positive: 0 }
  for (const f of findings) counts[f.severity]++
  let score = 100
    - 20 * counts.critical
    - 8 * counts.high
    - 2 * counts.medium
    - 0.5 * counts.low
    + Math.min(8, counts.positive)
  if (counts.critical === 0 && counts.high <= 1) score = Math.max(score, 60)
  if (counts.critical >= 3) score = Math.min(score, 35)
  score = Math.max(0, Math.min(100, Math.round(score)))
  const grade: AuditReport['grade'] =
    score >= 90 ? 'A' :
    score >= 80 ? 'B' :
    score >= 70 ? 'C' :
    score >= 60 ? 'D' : 'F'
  return { score, grade }
}

// ---------- Orchestrator ----------

export interface AuditOpts {
  url: string
  categories: TestCategory[]
}

function parseTarget(input: string): { primary: string; apex: string; origin: string } {
  let u = input.trim()
  if (!/^https?:\/\//.test(u)) u = 'https://' + u
  const url = new URL(u)
  const primary = url.hostname
  const parts = primary.split('.')
  const apex = parts.length >= 2 ? parts.slice(-2).join('.') : primary
  return { primary, apex, origin: `${url.protocol}//${primary}` }
}

export async function runAudit({ url, categories }: AuditOpts): Promise<AuditReport> {
  const { primary, apex, origin } = parseTarget(url)
  const want = (c: TestCategory) => categories.length === 0 || categories.includes(c)

  const findings: Finding[] = []
  let nextId = 1
  const add = (f: Omit<Finding, 'id'>) => findings.push({ id: `${f.severity[0].toUpperCase()}${nextId++}`, ...f })

  // Phase 1
  const hosts = want('infrastructure') ? await phase1Infrastructure(apex, primary) : [{ name: primary }]
  if (want('infrastructure')) {
    const stagings = hosts.filter((h) => /\b(stag|dev|test|qa|uat)\b/.test(h.name))
    if (stagings.length > 0) add({ severity: 'medium', phase: 1, title: 'Staging/dev subdomains publicly resolvable', evidence: stagings.map((s) => s.name).join(', ') })
    if (hosts.length >= 15) add({ severity: 'low', phase: 1, title: 'Wide subdomain footprint', evidence: `${hosts.length} subdomains resolving publicly` })
  }

  // Phase 2
  let certs: CertInfo[] = []
  if (want('tls')) {
    certs = await phase2Tls(hosts)
    for (const c of certs) {
      if (c.error === 'timeout' || /ECONNREFUSED|getaddrinfo/.test(c.error || '')) continue
      if (!c.valid && c.error) add({ severity: 'critical', phase: 2, title: `Invalid TLS on ${c.hostname}`, evidence: c.error })
      else if (typeof c.daysRemaining === 'number') {
        if (c.daysRemaining <= 0) add({ severity: 'critical', phase: 2, title: `Expired cert on ${c.hostname}`, evidence: `validTo=${c.validTo}` })
        else if (c.daysRemaining <= 30) add({ severity: 'medium', phase: 2, title: `Cert expiring soon on ${c.hostname}`, evidence: `${c.daysRemaining} days remaining` })
        else add({ severity: 'positive', phase: 2, title: `Valid TLS on ${c.hostname}`, evidence: `${c.daysRemaining} days remaining` })
      }
    }
  }

  // Phase 3
  const primaryUrl = `https://${primary}/`
  const h3 = want('headers') ? await phase3Headers(primaryUrl) : {
    headers: {}, missingSecurityHeaders: [], cookieIssues: [], corsIssues: [], versionDisclosed: null,
  }
  if (want('headers')) {
    if (h3.missingSecurityHeaders.includes('strict-transport-security')) add({ severity: 'high', phase: 3, title: 'Missing HSTS header', evidence: 'No Strict-Transport-Security on primary host' })
    if (h3.missingSecurityHeaders.includes('content-security-policy')) add({ severity: 'high', phase: 3, title: 'Missing Content-Security-Policy', evidence: 'No CSP header' })
    if (h3.missingSecurityHeaders.length >= 5) add({ severity: 'high', phase: 3, title: 'Broad security-header gap', evidence: `${h3.missingSecurityHeaders.length} of ${SEC_HEADERS.length} standard headers missing` })
    if (h3.missingSecurityHeaders.includes('x-frame-options')) add({ severity: 'medium', phase: 3, title: 'Missing X-Frame-Options', evidence: 'clickjacking defence absent' })
    if (h3.missingSecurityHeaders.includes('x-content-type-options')) add({ severity: 'medium', phase: 3, title: 'Missing X-Content-Type-Options', evidence: 'MIME sniffing not disabled' })
    if (h3.versionDisclosed) add({ severity: 'medium', phase: 3, title: 'Server version banner disclosed', evidence: h3.versionDisclosed })
    if (h3.missingSecurityHeaders.includes('referrer-policy')) add({ severity: 'low', phase: 3, title: 'Missing Referrer-Policy', evidence: 'default referrer leak risk' })
    if (h3.missingSecurityHeaders.includes('permissions-policy')) add({ severity: 'low', phase: 3, title: 'Missing Permissions-Policy', evidence: 'no explicit feature restrictions' })
    for (const c of h3.cookieIssues) add({ severity: c.includes('HttpOnly') ? 'high' : 'medium', phase: 3, title: 'Cookie flag issue', evidence: c })
    for (const c of h3.corsIssues) add({ severity: 'high', phase: 3, title: 'CORS misconfiguration', evidence: c })
    if (!h3.missingSecurityHeaders.includes('strict-transport-security')) add({ severity: 'positive', phase: 3, title: 'HSTS configured', evidence: h3.headers['strict-transport-security'] || '' })
    if (!h3.missingSecurityHeaders.includes('content-security-policy')) add({ severity: 'positive', phase: 3, title: 'CSP configured', evidence: (h3.headers['content-security-policy'] || '').slice(0, 100) })
  }

  // Phase 4
  let stack: StackFingerprint = { signals: [] }
  if (want('stack')) {
    const htmlFetch = await fetchText(primaryUrl, 80_000)
    if (htmlFetch) stack = fingerprintStack(h3.headers, htmlFetch.body)
    // EOL checks from server banner
    const server = (stack.server || '').toLowerCase()
    const m = server.match(/php\/(\d+)\.(\d+)/)
    if (m) {
      const major = Number(m[1]); const minor = Number(m[2])
      if (major < 8 || (major === 8 && minor < 1)) add({ severity: 'critical', phase: 4, title: `EOL PHP runtime (${m[0]})`, evidence: 'PHP <8.1 is end-of-life' })
    }
    if (/apache\/2\.[01234]\.\d+/.test(server)) add({ severity: 'medium', phase: 4, title: 'Old Apache release', evidence: server })
    if (/openssl\/1\./.test(server)) add({ severity: 'high', phase: 4, title: 'OpenSSL 1.x in banner', evidence: server })
    if (stack.framework === 'WordPress') add({ severity: 'medium', phase: 4, title: 'WordPress detected', evidence: 'confirm auto-updates and plugin hygiene' })
  }

  // Phase 5
  let exposedPaths: Array<{ path: string; status: number; size: number }> = []
  if (want('paths')) {
    exposedPaths = await phase5Paths(origin)
    for (const p of exposedPaths) {
      if (p.status >= 400) continue
      if (['/.env','/.env.backup','/.env.production'].includes(p.path)) add({ severity: 'critical', phase: 5, title: 'Public .env file', evidence: `${p.path} returned ${p.status}` })
      else if (['/phpinfo.php','/info.php'].includes(p.path)) add({ severity: 'critical', phase: 5, title: 'phpinfo() exposed', evidence: `${p.path} returned ${p.status}` })
      else if (p.path.startsWith('/.git/')) add({ severity: 'critical', phase: 5, title: 'Public .git directory', evidence: `${p.path} returned ${p.status} — source may be recoverable` })
      else if (['/telescope','/horizon','/_debugbar/open','/_ignition/health-check'].includes(p.path)) add({ severity: 'critical', phase: 5, title: 'Dev debug tool exposed', evidence: `${p.path} returned ${p.status}` })
      else if (/\.(sql|tar\.gz|tar|zip)$/.test(p.path)) add({ severity: 'critical', phase: 5, title: 'Backup artifact exposed', evidence: `${p.path} returned ${p.status}` })
      else if (['/phpmyadmin','/adminer','/adminer.php'].includes(p.path)) add({ severity: 'high', phase: 5, title: 'DB admin tool public', evidence: `${p.path} returned ${p.status}` })
      else if (p.path === '/wp-login.php') add({ severity: 'medium', phase: 5, title: 'WordPress login page exposed', evidence: 'enumerable' })
      else if (['/composer.json','/composer.lock','/package.json','/package-lock.json'].includes(p.path)) add({ severity: 'medium', phase: 5, title: 'Dependency manifest public', evidence: `${p.path} reveals exact versions` })
      else if (p.path === '/.DS_Store') add({ severity: 'medium', phase: 5, title: 'Public .DS_Store', evidence: 'file listing leak' })
    }
  }

  // Phase 7
  let assets: Array<{ path: string; lastModified?: string; ageDays?: number }> = []
  if (want('assets')) {
    assets = await phase7Assets(origin)
    const ages = assets.map((a) => a.ageDays || 0).filter((a) => a > 0)
    if (ages.length) {
      const max = Math.max(...ages)
      if (max > 365 * 5) add({ severity: 'high', phase: 7, title: 'Site appears abandoned', evidence: `oldest core asset is ${Math.round(max/365)} years old` })
      else if (max > 365 * 3) add({ severity: 'medium', phase: 7, title: 'Stale maintenance signal', evidence: `oldest core asset is ${Math.round(max/365)} years old` })
    }
  }

  const dedup = dedupeFindings(findings)
  const { score, grade } = scoreAudit(dedup)
  const critical = dedup.filter((f) => f.severity === 'critical').length
  const high = dedup.filter((f) => f.severity === 'high').length
  const executiveSummary =
    `${primary} audited on ${new Date().toISOString().slice(0, 10)}. ` +
    (stack.framework || stack.frontend || stack.platform
      ? `Built on ${[stack.platform, stack.framework, stack.frontend].filter(Boolean).join(' / ')}. `
      : '') +
    `Score ${score}/100 (grade ${grade}). ` +
    (critical ? `${critical} critical issue${critical > 1 ? 's' : ''} requires immediate attention. ` : '') +
    (high ? `${high} high-severity hygiene gap${high > 1 ? 's' : ''} detected.` : '')

  return {
    target: primary,
    auditDate: new Date().toISOString(),
    grade,
    score,
    findings: dedup,
    hosts,
    certs,
    stack: {
      platform: stack.platform || '',
      server: stack.server || '',
      runtime: stack.runtime || '',
      framework: stack.framework || '',
      frontend: stack.frontend || '',
    },
    missingHeaders: h3.missingSecurityHeaders,
    exposedPaths,
    assetAges: assets,
    executiveSummary,
  }
}
