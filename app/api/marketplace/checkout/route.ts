import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { createCheckoutSession, createCustomer } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Please login to continue' },
        { status: 401 }
      )
    }

    const { productId, purchaseType } = await req.json()

    if (!productId || !purchaseType) {
      return NextResponse.json(
        { error: 'Product ID and purchase type are required' },
        { status: 400 }
      )
    }

    // Get product
    const { data: product, error: productError } = await supabaseAdmin
      .from('marketplace_products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.status !== 'active') {
      return NextResponse.json(
        { error: 'Product is not available for purchase' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await createCustomer(user.email, user.name || undefined)
      stripeCustomerId = customer.id

      // Update user with Stripe customer ID
      await supabaseAdmin
        .from('rocketopp_users')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    // Determine price ID based on purchase type
    let priceId = product.stripe_price_id
    let mode: 'payment' | 'subscription' = 'payment'

    if (purchaseType === 'subscription' || purchaseType === 'lease_to_own') {
      mode = 'subscription'
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Product pricing not configured' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'

    const session = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      mode,
      successUrl: `${baseUrl}/dashboard?purchase=success&product=${product.slug}`,
      cancelUrl: `${baseUrl}/marketplace/${product.slug}?purchase=cancelled`,
      metadata: {
        user_id: user.id,
        product_id: product.id,
        purchase_type: purchaseType,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
