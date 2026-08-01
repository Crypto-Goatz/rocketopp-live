import { ImageResponse } from 'next/og'

/**
 * Shared Open Graph card renderer.
 *
 * Why a shared builder: 65 pages were shipping no og:image at all. The root
 * layout sets one, but Next replaces the whole `openGraph` object when a page
 * defines its own — and almost every page does, without an `images` key — so
 * the site-wide card was silently dropped on services, /compare, /web-design,
 * /marketplace and more. Pasting any of those links produced a bare grey box.
 *
 * File-convention opengraph-image routes cascade to nested segments, so one
 * card at a segment root covers everything beneath it. Routes with a [slug] get
 * their own so the card names the actual page.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export function ogCard({
  title,
  eyebrow,
  footnote = 'rocketopp.com',
  accent = '#ff6b35',
}: {
  title: string
  eyebrow?: string
  footnote?: string
  accent?: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: accent,
            opacity: 0.16,
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ff6b35, #e11d48)',
            }}
          />
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#fff' }}>
            RocketOpp
          </div>
          {eyebrow ? (
            <div
              style={{
                display: 'flex',
                marginLeft: 12,
                padding: '6px 16px',
                borderRadius: 999,
                border: `1px solid ${accent}66`,
                color: accent,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 78 ? 54 : 66,
            lineHeight: 1.12,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 22, color: '#a1a1aa' }}>{footnote}</div>
          <div
            style={{
              display: 'flex',
              height: 8,
              width: 220,
              borderRadius: 8,
              background: `linear-gradient(90deg, #ff6b35, ${accent})`,
            }}
          />
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
