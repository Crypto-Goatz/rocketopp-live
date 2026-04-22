import { NextRequest, NextResponse } from 'next/server'

/**
 * /HIPPA + /hippa (and any case) → 301 to /hipaa.
 * Common misspelling; preserve SEO + tracking by redirecting instead of 404.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const lower = pathname.toLowerCase()

  if (pathname === '/hipaa') {
    // canonical
    return NextResponse.next()
  }

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
  matcher: ['/hippa', '/hippa/:path*', '/HIPPA', '/HIPPA/:path*', '/HIPAA', '/HIPAA/:path*'],
}
