import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth/session'

export async function POST() {
  try {
    await destroySession()
    // Redirect to login page after logout
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('Logout error:', error)
    // Still redirect even on error
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }
}
