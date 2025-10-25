import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ 
        authenticated: false,
        user: null 
      })
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        avatar: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false,
      user: null,
      error: 'Failed to check authentication status'
    })
  }
}
