import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect_to')
  const siteName = searchParams.get('site_name')
  
  if (!redirectTo) {
    return NextResponse.json({ error: 'Missing redirect_to parameter' }, { status: 400 })
  }

  // 构建跨域登录URL
  const crossLoginUrl = new URL('/cross-login', request.url)
  crossLoginUrl.searchParams.set('redirect_to', redirectTo)
  if (siteName) {
    crossLoginUrl.searchParams.set('site_name', siteName)
  }

  return NextResponse.redirect(crossLoginUrl.toString())
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { redirectTo, siteName } = body

    if (!redirectTo) {
      return NextResponse.json({ error: 'Missing redirect_to parameter' }, { status: 400 })
    }

    // 构建跨域登录URL
    const crossLoginUrl = new URL('/cross-login', request.url)
    crossLoginUrl.searchParams.set('redirect_to', redirectTo)
    if (siteName) {
      crossLoginUrl.searchParams.set('site_name', siteName)
    }

    return NextResponse.json({ 
      loginUrl: crossLoginUrl.toString(),
      message: 'Cross-domain login URL generated successfully'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
