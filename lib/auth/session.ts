import { cookies } from 'next/headers'
import { supabaseAdmin, type RocketOppUser } from '@/lib/db/supabase'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const SESSION_COOKIE = 'rocketopp_session'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSession(userId: string, ip?: string, userAgent?: string): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await supabaseAdmin.from('rocketopp_sessions').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
    ip_address: ip,
    user_agent: userAgent
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/'
  })

  return token
}

export async function getSession(): Promise<RocketOppUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  const { data: session } = await supabaseAdmin
    .from('rocketopp_sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single()

  if (!session) return null

  // Check if expired
  if (new Date(session.expires_at) < new Date()) {
    await destroySession()
    return null
  }

  const { data: user } = await supabaseAdmin
    .from('rocketopp_users')
    .select('*')
    .eq('id', session.user_id)
    .single()

  return user as RocketOppUser | null
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await supabaseAdmin.from('rocketopp_sessions').delete().eq('token', token)
  }

  cookieStore.delete(SESSION_COOKIE)
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<{ user: RocketOppUser | null; error: string | null }> {
  // Check if email exists
  const { data: existing } = await supabaseAdmin
    .from('rocketopp_users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    return { user: null, error: 'Email already registered' }
  }

  const passwordHash = await hashPassword(password)

  const { data: user, error } = await supabaseAdmin
    .from('rocketopp_users')
    .insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name: name || null
    })
    .select()
    .single()

  if (error) {
    return { user: null, error: error.message }
  }

  return { user: user as RocketOppUser, error: null }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: RocketOppUser | null; error: string | null }> {
  const { data: user } = await supabaseAdmin
    .from('rocketopp_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) {
    return { user: null, error: 'Invalid email or password' }
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return { user: null, error: 'Invalid email or password' }
  }

  return { user: user as RocketOppUser, error: null }
}
