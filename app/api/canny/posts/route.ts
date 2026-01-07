import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canny } from '@/lib/canny/client'

export async function GET(request: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const boardID = url.searchParams.get('boardID') || undefined
    const status = url.searchParams.get('status') || undefined
    const search = url.searchParams.get('search') || undefined
    const sort = url.searchParams.get('sort') as any || 'trending'
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const skip = parseInt(url.searchParams.get('skip') || '0')

    const result = await canny.posts.list({
      boardID,
      status,
      search,
      sort,
      limit,
      skip,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Canny posts error:', error)
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
    const { boardID, title, details } = body

    if (!boardID || !title) {
      return NextResponse.json({ error: 'boardID and title are required' }, { status: 400 })
    }

    // First ensure user exists in Canny
    await canny.users.createOrUpdate({
      userID: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      avatarURL: user.avatar_url || undefined,
    })

    // Get the Canny user to get their Canny ID
    const cannyUser = await canny.users.retrieve({ userID: user.id })

    // Create the post
    const result = await canny.posts.create({
      authorID: cannyUser.id,
      boardID,
      title,
      details,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Canny create post error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
