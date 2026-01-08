import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const companySchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_industry: z.string().optional(),
  company_size: z.string().optional(),
  company_website: z.string().url().optional().or(z.literal('')),
  company_email: z.string().email().optional().or(z.literal('')),
  company_phone: z.string().optional(),
  company_address: z.string().optional(),
  company_description: z.string().max(500).optional(),
  social_linkedin: z.string().optional(),
  social_twitter: z.string().optional(),
  social_facebook: z.string().optional(),
  social_instagram: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('rocketopp_users')
      .select(`
        company_name, company_industry, company_size, company_website,
        company_logo, settings
      `)
      .eq('id', session.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
    }

    // Extract company data from user and settings
    const company = {
      company_name: user.company_name || '',
      company_industry: user.company_industry || '',
      company_size: user.company_size || '',
      company_website: user.company_website || '',
      company_logo: user.company_logo || '',
      company_email: user.settings?.company?.email || '',
      company_phone: user.settings?.company?.phone || '',
      company_address: user.settings?.company?.address || '',
      company_description: user.settings?.company?.description || '',
      social_linkedin: user.settings?.company?.social?.linkedin || '',
      social_twitter: user.settings?.company?.social?.twitter || '',
      social_facebook: user.settings?.company?.social?.facebook || '',
      social_instagram: user.settings?.company?.social?.instagram || '',
    }

    return NextResponse.json({ success: true, company })
  } catch (error) {
    console.error('Company fetch error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = companySchema.parse(body)

    // Get current settings
    const { data: currentUser } = await supabase
      .from('rocketopp_users')
      .select('settings')
      .eq('id', session.id)
      .single()

    const updateData = {
      company_name: validated.company_name,
      company_industry: validated.company_industry || null,
      company_size: validated.company_size || null,
      company_website: validated.company_website || null,
      settings: {
        ...(currentUser?.settings || {}),
        company: {
          email: validated.company_email || null,
          phone: validated.company_phone || null,
          address: validated.company_address || null,
          description: validated.company_description || null,
          social: {
            linkedin: validated.social_linkedin || null,
            twitter: validated.social_twitter || null,
            facebook: validated.social_facebook || null,
            instagram: validated.social_instagram || null,
          }
        }
      }
    }

    const { error } = await supabase
      .from('rocketopp_users')
      .update(updateData)
      .eq('id', session.id)

    if (error) {
      console.error('Company update error:', error)
      return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Company profile updated successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Company update error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
