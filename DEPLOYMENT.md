# 部署配置指南

## 1. 配置环境变量

在你的部署平台（Vercel/Netlify 等）中添加以下环境变量：

```bash
# Supabase 配置（与本地相同）
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥

# 生产环境域名（重要！）
NEXT_PUBLIC_SITE_URL=https://你的域名.com
```

## 2. 在 Supabase 中配置回调 URL

登录 Supabase Dashboard：

1. 进入你的项目
2. 点击左侧菜单 **Authentication** → **URL Configuration**
3. 在 **Redirect URLs** 中添加以下 URL（替换为你的实际域名）：

```
https://你的域名.com/auth/callback
https://你的域名.com/auth/cross-domain
http://localhost:3000/auth/callback
http://localhost:3000/auth/cross-domain
```

4. 在 **Site URL** 中设置：
```
https://你的域名.com
```

## 3. GitHub OAuth 配置

如果使用 GitHub 登录，需要在 GitHub OAuth App 中配置：

1. 访问 https://github.com/settings/developers
2. 找到你的 OAuth App
3. 更新 **Authorization callback URL**：
```
https://你的supabase项目ID.supabase.co/auth/v1/callback
```

## 4. GitLab OAuth 配置

如果使用 GitLab 登录，需要在 GitLab Application 中配置：

1. 访问 https://gitlab.com/-/profile/applications
2. 找到你的 Application
3. 更新 **Redirect URI**：
```
https://你的supabase项目ID.supabase.co/auth/v1/callback
```

## 5. 验证部署

部署完成后，测试以下功能：

- [ ] 邮箱密码登录
- [ ] GitHub OAuth 登录
- [ ] GitLab OAuth 登录
- [ ] 密码重置
- [ ] OTP 验证
- [ ] 跨域登录

## 常见问题

### Q: OAuth 回调仍然指向 localhost
**A:** 检查以下几点：
1. 确认 `NEXT_PUBLIC_SITE_URL` 环境变量已正确设置
2. 确认 Supabase 中的 Redirect URLs 包含生产域名
3. 重新部署应用以应用环境变量更改

### Q: 跨域登录不工作
**A:** 确保：
1. 目标网站的域名在 Supabase Redirect URLs 中
2. 目标网站正确集成了 auth-sdk.js
3. CORS 配置允许跨域请求
