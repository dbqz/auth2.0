import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { RefreshButton } from "@/components/refresh-button"
import Image from "next/image"
import {
  User,
  Mail,
  Shield,
  LogOut,
  CheckCircle,
  Calendar,
  Github,
  Gitlab
} from "lucide-react"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 如果未登录,重定向到登录页
  if (!user) {
    redirect("/login")
  }

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
  }

  // 获取用户头像
  const getUserAvatar = () => {
    if (user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }
    if (user.user_metadata?.picture) {
      return user.user_metadata.picture
    }
    return null
  }

  // 获取用户显示名称
  const getUserDisplayName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user.user_metadata?.name) {
      return user.user_metadata.name
    }
    return user.email?.split('@')[0] || '用户'
  }

  // 获取登录方式图标
  const getProviderIcon = () => {
    const provider = user.app_metadata?.provider
    switch (provider) {
      case 'github':
        return <Github className="w-4 h-4" />
      case 'gitlab':
        return <Gitlab className="w-4 h-4" />
      default:
        return <Mail className="w-4 h-4" />
    }
  }

  // 获取登录方式名称
  const getProviderName = () => {
    const provider = user.app_metadata?.provider
    switch (provider) {
      case 'github':
        return 'GitHub'
      case 'gitlab':
        return 'GitLab'
      case 'email':
        return '邮箱密码'
      default:
        return '邮箱密码'
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 头部区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            定边职教认证中心
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            安全可靠的统一身份认证平台
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          {/* 成功状态卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    认证成功
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    您已成功登录到定边职教认证系统
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 用户信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* 用户头像 */}
                <div className="flex-shrink-0">
                  {getUserAvatar() ? (
                    <Image
                      src={getUserAvatar()!}
                      alt="用户头像"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>

                {/* 用户信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {getUserDisplayName()}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 邮箱信息 */}
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </span>
                    </div>

                    {/* 登录方式 */}
                    <div className="flex items-center space-x-2">
                      {getProviderIcon()}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getProviderName()}
                      </span>
                    </div>

                    {/* 用户ID */}
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                        {user.id.slice(0, 8)}...
                      </span>
                    </div>

                    {/* 注册时间 */}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(user.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 功能区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 账户安全 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                账户安全
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">登录状态</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    已验证
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">认证方式</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getProviderName()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">最后登录</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : '刚刚'}
                  </span>
                </div>
              </div>
            </div>

            {/* 系统信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                系统信息
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">服务状态</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    正常运行
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">认证中心</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    定边职教
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">版本</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    v1.0.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <form action={handleSignOut} className="flex-1">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  安全退出
                </Button>
              </form>

              <RefreshButton />
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 定边职教 .
          </p>
        </div>
      </div>
    </div>
  )
}
