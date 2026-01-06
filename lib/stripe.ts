import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY - Stripe features will be disabled')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export interface CreateCheckoutParams {
  customerId?: string
  customerEmail?: string
  priceId: string
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  trialDays?: number
}

export async function createCheckoutSession({
  customerId,
  customerEmail,
  priceId,
  mode,
  successUrl,
  cancelUrl,
  metadata,
  trialDays
}: CreateCheckoutParams) {
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    allow_promotion_codes: true,
  }

  if (customerId) {
    sessionConfig.customer = customerId
  } else if (customerEmail) {
    sessionConfig.customer_email = customerEmail
  }

  if (mode === 'subscription' && trialDays) {
    sessionConfig.subscription_data = {
      trial_period_days: trialDays,
    }
  }

  const session = await stripe.checkout.sessions.create(sessionConfig)
  return session
}

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
  })
  return customer
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

// Lease-to-own specific: Calculate prorated ownership
export function calculateLeaseOwnership(
  paymentsMade: number,
  totalPayments: number
): { percentOwned: number; isFullyOwned: boolean } {
  const percentOwned = Math.min((paymentsMade / totalPayments) * 100, 100)
  return {
    percentOwned,
    isFullyOwned: paymentsMade >= totalPayments
  }
}
