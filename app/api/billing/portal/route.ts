import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { createPortalSession, createCustomer, stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { returnUrl } = await request.json()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'

    // Get or create Stripe customer
    let customerId = (user as { stripe_customer_id?: string }).stripe_customer_id

    if (!customerId) {
      // Create new Stripe customer
      const customer = await createCustomer(user.email, user.name || undefined)
      customerId = customer.id

      // Save to database
      await supabaseAdmin
        .from('rocketopp_users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create billing portal session
    const session = await createPortalSession(
      customerId,
      returnUrl || `${baseUrl}/account`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json({ error: 'Failed to create billing portal' }, { status: 500 })
  }
}

// Get payment methods
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customerId = (user as { stripe_customer_id?: string }).stripe_customer_id

    if (!customerId) {
      return NextResponse.json({ paymentMethods: [] })
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    })

    // Get default payment method
    const customer = await stripe.customers.retrieve(customerId) as { invoice_settings?: { default_payment_method?: string } }
    const defaultMethodId = customer.invoice_settings?.default_payment_method

    const methods = paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: pm.id === defaultMethodId
    }))

    return NextResponse.json({ paymentMethods: methods })
  } catch (error) {
    console.error('Get payment methods error:', error)
    return NextResponse.json({ error: 'Failed to get payment methods' }, { status: 500 })
  }
}
