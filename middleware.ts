import { NextRequest, NextResponse } from 'next/server'

/**
 * Two jobs:
 *  1. /HIPPA + /hippa (any case) → 301 to /hipaa (common misspelling; keep SEO + tracking).
 *  2. /admin (pages + API) is private: United States only and never indexed.
 *     Vercel stamps every request with the visitor's country; outside the US the
 *     path answers 404 as if it did not exist. No header (local dev) → allowed;
 *     the signed-session gate in app/admin/layout.tsx still applies.
 */
function isAdminPath(p: string): boolean { return p === '/admin' || p.startsWith('/admin/') || p.startsWith('/api/admin/') }

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const lower = pathname.toLowerCase()

  if (isAdminPath(pathname)) {
    const country = (req.headers.get('x-vercel-ip-country') || '').toUpperCase()
    if (country && country !== 'US') return new NextResponse(null, { status: 404 })
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex')
    res.headers.set('Cache-Control', 'private, no-store')
    return res
  }

  if (pathname === '/hipaa') return NextResponse.next()

  if (lower === '/hippa' || lower === '/hippa/' || pathname === '/HIPPA' || lower.startsWith('/hippa/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/hippa/i, '/hipaa')
    return NextResponse.redirect(url, 301)
  }

  if (pathname === '/HIPAA' || pathname === '/HIPAA/') {
    const url = req.nextUrl.clone()
    url.pathname = '/hipaa'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/hippa', '/hippa/:path*', '/HIPPA', '/HIPPA/:path*', '/HIPAA', '/HIPAA/:path*', '/admin', '/admin/:path*', '/api/admin/:path*'],
}
