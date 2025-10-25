import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email,
      avatar: user.user_metadata?.avatar_url,
      provider: user.app_metadata?.provider,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get user information' }, { status: 500 })
  }
}
