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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error) {
      setError((error as Error).message || "发送重置邮件失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <h1 className="text-xl font-bold">重置密码</h1>
          <FieldDescription>
            我们已向您的邮箱发送了重置密码的链接，请查收并点击链接完成密码重置。
          </FieldDescription>
        </div>
        
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            重置邮件已发送！请检查您的邮箱
          </p>
        </div>

        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            返回登录页面
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleResetPassword}>
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
            <h1 className="text-xl font-bold">重置密码</h1>
            <FieldDescription>
              输入您的邮箱地址，我们将发送重置密码的链接给您
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
            <Button type="submit" disabled={loading}>
              {loading ? "发送中..." : "发送重置链接"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          记起密码了？{" "}
          <Link href="/login" className="text-primary hover:underline">
            立即登录
          </Link>
        </p>
      </div>
      
      <FieldDescription className="px-6 text-center">
        重置密码即表示您同意我们的 <a href="#" className="underline">服务条款</a>{" "}
        和 <a href="#" className="underline">隐私政策</a>
      </FieldDescription>
    </div>
  )
}
