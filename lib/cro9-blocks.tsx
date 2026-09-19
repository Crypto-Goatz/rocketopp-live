/**
 * RENDER CRO9's APPROVED CONTENT BLOCKS FOR THIS PAGE.
 *
 * The body counterpart to lib/cro9-meta.ts. CRO9 stores approved copy for a
 * NAMED REGION of a path; this is what turns that row into something a visitor
 * sees. Same endpoint, same key, same fail-to-nothing contract as the metadata
 * helper — any error, timeout or non-200 renders nothing and the page is
 * exactly as it would have been.
 *
 * THE SITE DECIDES WHERE A BLOCK GOES. CRO9 cannot position anything and cannot
 * reach a region this file is not placed in. Putting <Cro9Block slot="faq" /> in
 * your JSX is the whole opt-in; removing it is the whole opt-out.
 *
 * WHY THE HTML IS RE-SANITISED HERE even though CRO9 refuses scripts on the way
 * in: this is the last line before dangerouslySetInnerHTML on a live page. A
 * guard that lives only on the far side of a network boundary is a guard you
 * are trusting someone else to keep running. Tags are allow-listed and every
 * attribute except a safe href is dropped, so the worst a compromised or buggy
 * upstream can do is render plain prose.
 */
import type { ReactElement } from 'react'

const CRO9_BASE = 'https://www.cro9.com'
const CRO9_KEYS = ['cro9_6b7b63c6bf189906887805bd64c4330ad76dc10dc2db229b']

export type Cro9Block = { html: string; jsonLd?: unknown }

export async function cro9Blocks(path: string): Promise<Record<string, Cro9Block>> {
  for (const key of CRO9_KEYS) {
    try {
      const res = await fetch(
        `${CRO9_BASE}/api/cro9/meta?key=${encodeURIComponent(key)}&path=${encodeURIComponent(path)}`,
        { next: { revalidate: 60 }, signal: AbortSignal.timeout(2500) },
      )
      if (!res.ok) continue
      const body = (await res.json()) as { blocks?: Record<string, { html?: unknown; jsonLd?: unknown }> }
      const raw = body?.blocks
      if (!raw || typeof raw !== 'object') continue
      const out: Record<string, Cro9Block> = {}
      for (const [slot, b] of Object.entries(raw)) {
        if (b && typeof b.html === 'string' && b.html.trim()) {
          out[slot] = { html: b.html, ...(b.jsonLd ? { jsonLd: b.jsonLd } : {}) }
        }
      }
      if (Object.keys(out).length) return out
    } catch {
      /* a broken CRO9 must never take a page down */
    }
  }
  return {}
}

const ALLOWED = new Set(['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'a', 'blockquote'])

/**
 * Allow-list sanitiser. Anything not explicitly permitted is removed, INCLUDING
 * its attributes — the common mistake is allow-listing tags and then letting
 * `onclick` or `href="javascript:"` through on a tag that is itself fine.
 */
export function sanitiseBlock(html: string): string {
  return html.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (_m, tag: string, attrs: string) => {
    const name = tag.toLowerCase()
    if (!ALLOWED.has(name)) return ''
    const closing = _m.startsWith('</')
    if (closing) return `</${name}>`
    if (name === 'a') {
      const href = /href\s*=\s*"([^"]*)"/i.exec(attrs)?.[1] ?? ''
      // Relative, http(s) and mailto only. Everything else — javascript:,
      // data:, vbscript: — becomes a plain anchor with no destination.
      const safe = /^(https?:\/\/|\/|mailto:|#)/i.test(href) ? href : ''
      return safe ? `<a href="${safe.replace(/"/g, '&quot;')}" rel="nofollow noopener">` : '<a>'
    }
    return `<${name}>`
  })
}

/**
 * One CRO9-managed region. Renders nothing at all when CRO9 has no block for
 * this path and slot, so it is safe to place speculatively.
 */
export async function Cro9Block({
  path,
  slot,
  className,
}: {
  path: string
  slot: string
  className?: string
}): Promise<ReactElement | null> {
  const blocks = await cro9Blocks(path)
  const block = blocks[slot]
  if (!block) return null

  const html = sanitiseBlock(block.html)
  if (!html.trim()) return null

  return (
    <section data-cro9-block={slot} className={className}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {block.jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block.jsonLd).replace(/</g, '\\u003c') }}
        />
      ) : null}
    </section>
  )
}
