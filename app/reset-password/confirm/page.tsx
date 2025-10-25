"use client"

import { useState, useEffect } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function ResetPasswordConfirmPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 检查是否有有效的重置会话
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/reset-password')
        return
      }
    }
    
    checkSession()
  }, [router, supabase.auth])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // 验证密码确认
    if (password !== confirmPassword) {
      setError("密码和确认密码不匹配")
      setLoading(false)
      return
    }

    // 验证密码长度
    if (password.length < 6) {
      setError("密码长度至少需要6个字符")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // 3秒后重定向到登录页面
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setError((error as Error).message || "密码更新失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <h1 className="text-xl font-bold">密码重置成功</h1>
              <FieldDescription>
                您的密码已成功更新，即将跳转到登录页面。
              </FieldDescription>
            </div>
            
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                密码重置成功！请使用新密码登录
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <form onSubmit={handleUpdatePassword}>
          <FieldGroup>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center gap-2 text-center">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">定边职教</span>
              </a>
              <h1 className="text-xl font-bold">设置新密码</h1>
              <FieldDescription>
                请输入您的新密码
              </FieldDescription>
            </div>
            <Field>
              <FieldLabel htmlFor="password">新密码</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <FieldDescription>
                密码长度至少需要6个字符
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">确认新密码</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Field>
            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "更新中..." : "更新密码"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
