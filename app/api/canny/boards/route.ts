import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canny } from '@/lib/canny/client'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await canny.boards.list()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Canny boards error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
