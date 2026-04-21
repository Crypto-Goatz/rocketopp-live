/**
 * HIPAA Scan Proxy — forwards to 0nCore scanner
 * POST /api/hipaa/scan
 */

import { NextRequest, NextResponse } from 'next/server'

const ONCORE_URL = process.env.ONCORE_URL || 'https://0ncore.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { publicUrl, dashboardUrl, email, entityType, state, scanType } = body

    if (!publicUrl) {
      return NextResponse.json({ error: 'publicUrl is required' }, { status: 400 })
    }

    const res = await fetch(`${ONCORE_URL}/api/hipaa/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicUrl,
        dashboardUrl: dashboardUrl || publicUrl,
        contactEmail: email,
        entityType: entityType || 'unsure',
        primaryState: state,
        public: true,
      }),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('HIPAA scan proxy error:', error)
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}
