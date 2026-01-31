import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { supabaseAdmin } from '@/lib/db/supabase'
import { stripe } from '@/lib/stripe'

interface ProductAccess {
  product: string
  name: string
  accessType: string
  status: 'active' | 'inactive' | 'trial' | 'expired'
  expiresAt?: string
  url: string
}

const PRODUCT_INFO: Record<string, { name: string; url: string }> = {
  'rocket-plus': { name: 'Rocket+', url: 'https://rocketadd.com' },
  'mcpfed': { name: 'MCPFED', url: 'https://mcpfed.com' },
  'sxo': { name: 'SXO Website Scanner', url: 'https://sxowebsite.com' },
  'cro9': { name: 'CRO9', url: 'https://cro9.io' },
  'rocketpost': { name: 'RocketPost', url: 'https://rocketpost.ai' },
  'botcoaches': { name: 'BotCoaches', url: 'https://botcoaches.com' },
  'rocketeq': { name: 'RocketEQ', url: 'https://rocketeq.com' }
}

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get product access from database
    const { data: accessRecords } = await supabaseAdmin
      .from('rocketopp_product_access')
      .select('*')
      .eq('user_id', user.id)

    // Get marketplace purchases
    const { data: purchases } = await supabaseAdmin
      .from('user_purchases')
      .select(`
        *,
        product:marketplace_products(slug, name)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')

    const products: ProductAccess[] = []

    // Add product access records
    if (accessRecords) {
      for (const record of accessRecords) {
        const info = PRODUCT_INFO[record.product] || { name: record.product, url: '#' }
        const isExpired = record.expires_at && new Date(record.expires_at) < new Date()

        products.push({
          product: record.product,
          name: info.name,
          accessType: record.access_type,
          status: isExpired ? 'expired' : record.access_type === 'trial' ? 'trial' : 'active',
          expiresAt: record.expires_at,
          url: info.url
        })
      }
    }

    // Add marketplace purchases
    if (purchases) {
      for (const purchase of purchases) {
        if (purchase.product?.slug && !products.find(p => p.product === purchase.product.slug)) {
          const info = PRODUCT_INFO[purchase.product.slug] || { name: purchase.product.name, url: '#' }
          products.push({
            product: purchase.product.slug,
            name: purchase.product.name || info.name,
            accessType: purchase.purchase_type,
            status: purchase.status === 'active' ? 'active' : 'inactive',
            expiresAt: purchase.expires_at,
            url: info.url
          })
        }
      }
    }

    // Always add free access to SXO (basic tier)
    if (!products.find(p => p.product === 'sxo')) {
      products.push({
        product: 'sxo',
        name: 'SXO Website Scanner',
        accessType: 'free',
        status: 'active',
        url: 'https://sxowebsite.com'
      })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get user products error:', error)
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 })
  }
}
