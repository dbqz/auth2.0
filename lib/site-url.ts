/**
 * 获取站点 URL
 * 优先使用环境变量，如果没有则使用 window.location.origin（仅客户端）
 */
export function getSiteUrl(): string {
  // 优先使用环境变量
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // 客户端回退到 window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // 服务端默认值（不应该到这里）
  return 'http://localhost:3000'
}
