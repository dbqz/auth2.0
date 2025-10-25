import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const wz = searchParams.get('wz') // 获取重定向URL参数

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // 优先使用 wz 参数，然后是 next 参数
      const redirectUrl = wz ? decodeURIComponent(wz) : `${origin}${next}`
      return NextResponse.redirect(redirectUrl)
    }

    // 如果交换 code 失败，记录错误并重定向到登录页
    console.error('Auth callback error:', error)
  }

  // 如果出错或没有 code,重定向回登录页面
  return NextResponse.redirect(`${origin}/login`)
}
