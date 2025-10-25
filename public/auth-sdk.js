/**
 * 定边职教跨域认证 SDK
 * 供主域名下的其他网站使用
 */
class DingbianAuthSDK {
  constructor(config) {
    this.authDomain = config.authDomain || 'http://localhost:3000'
    this.siteName = config.siteName || ''
    this.onSuccess = config.onSuccess || (() => {})
    this.onError = config.onError || (() => {})
  }

  /**
   * 检查用户是否已登录
   */
  async checkAuth() {
    try {
      const response = await fetch(`${this.authDomain}/api/auth/status`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('检查认证状态失败:', error)
      return { authenticated: false }
    }
  }

  /**
   * 启动跨域登录流程
   */
  login(options = {}) {
    const { redirectTo = window.location.href, siteName = this.siteName } = options
    
    const loginUrl = new URL('/cross-login', this.authDomain)
    loginUrl.searchParams.set('redirect_to', redirectTo)
    if (siteName) {
      loginUrl.searchParams.set('site_name', siteName)
    }

    // 打开登录窗口
    const popup = window.open(
      loginUrl.toString(),
      'dingbian-auth',
      'width=500,height=700,scrollbars=yes,resizable=yes'
    )

    // 监听登录完成
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        this.handleLoginComplete()
      }
    }, 1000)

    return popup
  }

  /**
   * 处理登录完成
   */
  async handleLoginComplete() {
    try {
      const authStatus = await this.checkAuth()
      if (authStatus.authenticated) {
        this.onSuccess(authStatus.user)
      } else {
        this.onError(new Error('登录失败'))
      }
    } catch (error) {
      this.onError(error)
    }
  }

  /**
   * 退出登录
   */
  async logout() {
    try {
      const response = await fetch(`${this.authDomain}/api/auth/logout`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        this.onSuccess(null) // 退出成功
      } else {
        this.onError(new Error('退出登录失败'))
      }
    } catch (error) {
      this.onError(error)
    }
  }

  /**
   * 获取用户信息
   */
  async getUser() {
    try {
      const response = await fetch(`${this.authDomain}/api/auth/user`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }
}

// 全局暴露
window.DingbianAuthSDK = DingbianAuthSDK

// 使用示例
window.DingbianAuth = {
  init: (config) => new DingbianAuthSDK(config)
}
