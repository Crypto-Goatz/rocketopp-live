import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

interface HealthCheck {
  service: string
  status: 'ok' | 'error' | 'missing'
  message: string
  latency?: number
}

export async function GET() {
  const checks: HealthCheck[] = []
  const startTime = Date.now()

  // 1. Supabase Check
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      checks.push({ service: 'Supabase', status: 'missing', message: 'Missing SUPABASE env vars' })
    } else {
      const start = Date.now()
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase.from('rocketopp_users').select('id').limit(1)
      const latency = Date.now() - start

      if (error) {
        checks.push({ service: 'Supabase', status: 'error', message: error.message, latency })
      } else {
        checks.push({ service: 'Supabase', status: 'ok', message: 'Connected', latency })
      }
    }
  } catch (e) {
    checks.push({ service: 'Supabase', status: 'error', message: String(e) })
  }

  // 2. Anthropic (Claude) Check
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    if (!anthropicKey) {
      checks.push({ service: 'Anthropic', status: 'missing', message: 'Missing ANTHROPIC_API_KEY' })
    } else {
      const start = Date.now()
      const anthropic = new Anthropic({ apiKey: anthropicKey })

      // Just verify the key works with a minimal request
      await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })
      const latency = Date.now() - start

      checks.push({ service: 'Anthropic', status: 'ok', message: 'Claude API working', latency })
    }
  } catch (e: unknown) {
    const error = e as { status?: number; message?: string }
    if (error.status === 401) {
      checks.push({ service: 'Anthropic', status: 'error', message: 'Invalid API key' })
    } else {
      checks.push({ service: 'Anthropic', status: 'error', message: error.message || String(e) })
    }
  }

  // 3. GHL Check
  try {
    const ghlLocationId = process.env.GHL_LOCATION_ID
    const ghlPit = process.env.GHL_LOCATION_PIT

    if (!ghlLocationId || !ghlPit) {
      checks.push({ service: 'GHL', status: 'missing', message: 'Missing GHL_LOCATION_ID or GHL_LOCATION_PIT' })
    } else {
      const start = Date.now()
      const response = await fetch(
        `https://services.leadconnectorhq.com/locations/${ghlLocationId}`,
        {
          headers: {
            'Authorization': `Bearer ${ghlPit}`,
            'Version': '2021-07-28'
          }
        }
      )
      const latency = Date.now() - start

      if (response.ok) {
        const data = await response.json()
        checks.push({
          service: 'GHL',
          status: 'ok',
          message: `Connected to: ${data.location?.name || ghlLocationId}`,
          latency
        })
      } else {
        checks.push({ service: 'GHL', status: 'error', message: `HTTP ${response.status}`, latency })
      }
    }
  } catch (e) {
    checks.push({ service: 'GHL', status: 'error', message: String(e) })
  }

  // 4. Stripe Check
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      checks.push({ service: 'Stripe', status: 'missing', message: 'Missing STRIPE_SECRET_KEY' })
    } else {
      const start = Date.now()
      const response = await fetch('https://api.stripe.com/v1/balance', {
        headers: { 'Authorization': `Bearer ${stripeKey}` }
      })
      const latency = Date.now() - start

      if (response.ok) {
        checks.push({ service: 'Stripe', status: 'ok', message: 'Connected', latency })
      } else {
        checks.push({ service: 'Stripe', status: 'error', message: `HTTP ${response.status}`, latency })
      }
    }
  } catch (e) {
    checks.push({ service: 'Stripe', status: 'error', message: String(e) })
  }

  // 5. Google OAuth Check
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!googleClientId || !googleClientSecret) {
    checks.push({ service: 'Google OAuth', status: 'missing', message: 'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET' })
  } else {
    checks.push({ service: 'Google OAuth', status: 'ok', message: 'Credentials configured' })
  }

  // 6. Gamma Check
  const gammaKey = process.env.GAMMA_API_KEY
  if (!gammaKey) {
    checks.push({ service: 'Gamma', status: 'missing', message: 'Missing GAMMA_API_KEY' })
  } else {
    checks.push({ service: 'Gamma', status: 'ok', message: 'Key configured' })
  }

  // 7. Session Secret
  const sessionSecret = process.env.SESSION_SECRET
  if (!sessionSecret) {
    checks.push({ service: 'Session', status: 'missing', message: 'Missing SESSION_SECRET' })
  } else {
    checks.push({ service: 'Session', status: 'ok', message: 'Configured' })
  }

  // Summary
  const totalLatency = Date.now() - startTime
  const okCount = checks.filter(c => c.status === 'ok').length
  const errorCount = checks.filter(c => c.status === 'error').length
  const missingCount = checks.filter(c => c.status === 'missing').length

  return NextResponse.json({
    status: errorCount > 0 ? 'degraded' : missingCount > 0 ? 'incomplete' : 'healthy',
    summary: {
      ok: okCount,
      errors: errorCount,
      missing: missingCount,
      total: checks.length
    },
    checks,
    totalLatency,
    timestamp: new Date().toISOString()
  })
}
