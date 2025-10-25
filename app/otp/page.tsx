import { OTPForm } from "@/components/otp-form"
import { Suspense } from "react"

export default function OTPPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-pulse">加载中...</div>
          </div>
        }>
          <OTPForm />
        </Suspense>
      </div>
    </div>
  )
}
