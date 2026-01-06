import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/db/supabase'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.user_id
        const productId = session.metadata?.product_id
        const purchaseType = session.metadata?.purchase_type as 'one_time' | 'subscription' | 'lease_to_own'

        if (!userId || !productId) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Get product for lease terms
        const { data: product } = await supabaseAdmin
          .from('marketplace_products')
          .select('lease_terms, downloads')
          .eq('id', productId)
          .single()

        // Create purchase record
        await supabaseAdmin.from('user_purchases').insert({
          user_id: userId,
          product_id: productId,
          purchase_type: purchaseType,
          status: 'active',
          stripe_subscription_id: session.subscription as string || null,
          stripe_payment_intent_id: session.payment_intent as string || null,
          lease_payments_made: purchaseType === 'lease_to_own' ? 1 : null,
          lease_total_payments: product?.lease_terms?.total_months || null,
          purchased_at: new Date().toISOString(),
        })

        // Update product download count
        if (product) {
          await supabaseAdmin
            .from('marketplace_products')
            .update({ downloads: (product.downloads || 0) + 1 })
            .eq('id', productId)
        }

        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        // Find the purchase by subscription ID
        const { data: purchase } = await supabaseAdmin
          .from('user_purchases')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (purchase && purchase.purchase_type === 'lease_to_own') {
          const newPaymentCount = (purchase.lease_payments_made || 0) + 1
          const isFullyOwned = newPaymentCount >= (purchase.lease_total_payments || 12)

          await supabaseAdmin
            .from('user_purchases')
            .update({
              lease_payments_made: newPaymentCount,
              lease_owned: isFullyOwned,
              status: isFullyOwned ? 'completed' : 'active',
            })
            .eq('id', purchase.id)

          // If fully owned, cancel the subscription
          if (isFullyOwned) {
            await stripe.subscriptions.cancel(subscriptionId)
          }
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabaseAdmin
          .from('user_purchases')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Update status based on subscription status
        let status: 'active' | 'cancelled' | 'pending' = 'active'
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          status = 'cancelled'
        } else if (subscription.status === 'past_due') {
          status = 'pending'
        }

        await supabaseAdmin
          .from('user_purchases')
          .update({ status })
          .eq('stripe_subscription_id', subscription.id)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
