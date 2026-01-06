import { supabaseAdmin, type MarketplaceProduct } from '@/lib/db/supabase'

export async function getProducts(options?: {
  category?: string
  status?: string
  featured?: boolean
  limit?: number
  offset?: number
}): Promise<MarketplaceProduct[]> {
  let query = supabaseAdmin
    .from('marketplace_products')
    .select('*')

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.status) {
    query = query.eq('status', options.status)
  } else {
    // Default: only show active and coming_soon
    query = query.in('status', ['active', 'coming_soon'])
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  query = query.order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data } = await query

  return (data || []) as MarketplaceProduct[]
}

export async function getProductBySlug(slug: string): Promise<MarketplaceProduct | null> {
  const { data } = await supabaseAdmin
    .from('marketplace_products')
    .select('*')
    .eq('slug', slug)
    .single()

  return data as MarketplaceProduct | null
}

export async function getCategories() {
  const { data } = await supabaseAdmin
    .from('marketplace_categories')
    .select('*')
    .order('sort_order')

  return data || []
}

export async function getUserPurchases(userId: string) {
  const { data } = await supabaseAdmin
    .from('user_purchases')
    .select(`
      *,
      product:marketplace_products(*)
    `)
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false })

  return data || []
}

export async function checkUserOwnsProduct(userId: string, productId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('user_purchases')
    .select('id, status, lease_owned')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .in('status', ['active', 'completed'])
    .single()

  if (!data) return false

  // For lease-to-own, check if they've completed payments
  if (data.lease_owned) return true
  if (data.status === 'active' || data.status === 'completed') return true

  return false
}

export function formatPrice(price: number, priceType: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)

  switch (priceType) {
    case 'subscription':
      return `${formatted}/mo`
    case 'lease_to_own':
      return `${formatted}/mo to own`
    default:
      return formatted
  }
}

export function getProductSchema(product: MarketplaceProduct) {
  return {
    '@context': 'https://schema.org',
    '@type': product.schema_type || 'SoftwareApplication',
    name: product.name,
    description: product.description,
    applicationCategory: product.category,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder'
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      ratingCount: 1 // Would come from review_count
    } : undefined
  }
}
