"use client"

import { useState, useEffect } from "react"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter, useSearchParams } from "next/navigation"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState(0)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // 从 URL 参数获取邮箱
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("请输入完整的6位验证码")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        token: otp,
        type: 'signup',
        email: email
      })

      if (error) throw error

      // 验证成功，重定向到首页
      router.push('/')
    } catch (error) {
      setError((error as Error).message || "验证码无效，请重试")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("邮箱地址不可用")
      return
    }

    setResendLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error

      setCountdown(60) // 60秒倒计时
    } catch (error) {
      setError((error as Error).message || "重新发送失败，请重试")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleVerify}>
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
            <h1 className="text-xl font-bold">输入验证码</h1>
            <FieldDescription>
              我们已向 {email} 发送了6位验证码
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              验证码
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              value={otp}
              onChange={setOtp}
              required
              containerClassName="gap-4"
              disabled={loading}
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              {countdown > 0 ? (
                <span>请等待 {countdown} 秒后重新发送</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "发送中..." : "重新发送"}
                </button>
              )}
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" disabled={loading || otp.length !== 6}>
              {loading ? "验证中..." : "验证"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        验证即表示您同意我们的 <a href="#" className="underline">服务条款</a>{" "}
        和 <a href="#" className="underline">隐私政策</a>
      </FieldDescription>
    </div>
  )
}
