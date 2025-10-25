import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect_to') // 目标网站的URL
  const next = searchParams.get('next') ?? '/'
  const wz = searchParams.get('wz') // 获取重定向URL参数

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 获取用户信息
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && redirectTo) {
        // 构建重定向URL，包含用户信息
        const targetUrl = new URL(redirectTo)
        targetUrl.searchParams.set('auth_success', 'true')
        targetUrl.searchParams.set('user_id', user.id)
        targetUrl.searchParams.set('user_email', user.email || '')
        targetUrl.searchParams.set('access_token', (await supabase.auth.getSession()).data.session?.access_token || '')
        
        return NextResponse.redirect(targetUrl.toString())
      } else if (user) {
        // 优先使用 wz 参数，然后是 next 参数
        const redirectUrl = wz ? decodeURIComponent(wz) : next
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // 如果出错或没有用户信息，重定向回登录页面
  return NextResponse.redirect(`${origin}/login`)
}
