import { NextResponse } from 'next/server'
import { isAdmin, getAdminUser } from '@/lib/auth/admin'

export async function GET() {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const user = await getAdminUser()
    return NextResponse.json({
      authorized: true,
      role: user?.role,
      email: user?.email
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
