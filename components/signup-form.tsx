"use client"

import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/otp?email=${encodeURIComponent(email)}`,
        },
      })

      if (error) throw error

      // 重定向到 OTP 验证页面
      window.location.href = `/otp?email=${encodeURIComponent(email)}`
    } catch (error) {
      setError((error as Error).message || "注册失败，请检查您的邮箱和密码")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "github" | "gitlab") => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      setError((error as Error).message || "OAuth 登录失败")
      setLoading(false)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleRegister}>
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
            <h1 className="text-xl font-bold">欢迎来到定边职教</h1>
            <FieldDescription>
              已有账号？ <Link href="/login" className="text-primary hover:underline">立即登录</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">邮箱</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">密码</FieldLabel>
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
            <FieldLabel htmlFor="confirmPassword">确认密码</FieldLabel>
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
              {loading ? "注册中..." : "创建账号"}
            </Button>
          </Field>
          <FieldSeparator>或使用第三方账号注册</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthLogin("github")}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  fill="currentColor"
                />
              </svg>
              GitHub
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthLogin("gitlab")}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                <path
                  d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 0 0-.867 0L16.418 9.45H7.582L4.919 1.263a.455.455 0 0 0-.867 0L1.388 9.452.045 13.587a.924.924 0 0 0 .331 1.023L12 23.054l11.624-8.443a.92.92 0 0 0 .331-1.024"
                  fill="#fc6d26"
                />
              </svg>
              GitLab
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        注册即表示您同意我们的 <a href="#" className="underline">服务条款</a>{" "}
        和 <a href="#" className="underline">隐私政策</a>
      </FieldDescription>
    </div>
  )
}
