import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { ghl } from '@/lib/ghl/client'

export async function GET(request: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const query = url.searchParams.get('query') || undefined
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const skip = parseInt(url.searchParams.get('skip') || '0')

    const result = await ghl.contacts.list({ query, limit, skip })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('GHL contacts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, tags } = body

    const result = await ghl.contacts.create({
      firstName,
      lastName,
      email,
      phone,
      tags,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('GHL create contact error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
