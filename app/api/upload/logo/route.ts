import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'logos')
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 2MB' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload PNG, JPG, WebP, or SVG' }, { status: 400 })
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const timestamp = Date.now()
    const filename = `logo-${session.id}-${timestamp}.${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    // Read file buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // URL path for the uploaded file
    const url = `/uploads/logos/${filename}`

    // Update user's company_logo in database
    const { error: dbError } = await supabase
      .from('rocketopp_users')
      .update({ company_logo: url })
      .eq('id', session.id)

    if (dbError) {
      console.error('Failed to update company_logo:', dbError)
      // Don't fail the request, file is still uploaded
    }

    return NextResponse.json({
      success: true,
      url,
      filename,
      message: 'Logo uploaded successfully',
    })
  } catch (error) {
    console.error('Logo upload error:', error)
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear logo from database
    const { error } = await supabase
      .from('rocketopp_users')
      .update({ company_logo: null })
      .eq('id', session.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to remove logo' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Logo removed successfully',
    })
  } catch (error) {
    console.error('Logo delete error:', error)
    return NextResponse.json({ error: 'Failed to remove logo' }, { status: 500 })
  }
}
