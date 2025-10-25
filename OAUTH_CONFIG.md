# OAuth 第三方登录配置指南

## 重要提示

第三方 OAuth 登录需要在 Supabase Dashboard 中配置每个提供商。以下是详细步骤:

---

## 1. GitHub OAuth 配置

### 步骤 A: 在 GitHub 创建 OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 **New OAuth App**
3. 填写以下信息:
   - **Application name**: `定边职教`
   - **Homepage URL**: `http://localhost:3000` (开发环境)
   - **Authorization callback URL**: `https://jfmtjvitsrfxoitmqtve.supabase.co/auth/v1/callback`
4. 点击 **Register application**
5. 复制 **Client ID**
6. 点击 **Generate a new client secret** 并复制 **Client Secret**

### 步骤 B: 在 Supabase 配置 GitHub

1. 访问 https://supabase.com/dashboard/project/jfmtjvitsrfxoitmqtve/auth/providers
2. 找到 **GitHub** 提供商
3. 点击展开配置
4. 启用 **Enable Sign in with GitHub**
5. 粘贴 **Client ID** 和 **Client Secret**
6. 点击 **Save**

---

## 2. GitLab OAuth 配置

### 步骤 A: 在 GitLab 创建 OAuth App

1. 访问 https://gitlab.com/-/profile/applications
2. 填写以下信息:
   - **Name**: `定边职教`
   - **Redirect URI**: `https://jfmtjvitsrfxoitmqtve.supabase.co/auth/v1/callback`
   - **Scopes**: 勾选 `read_user`
3. 点击 **Save application**
4. 复制 **Application ID** 和 **Secret**

### 步骤 B: 在 Supabase 配置 GitLab

1. 访问 https://supabase.com/dashboard/project/jfmtjvitsrfxoitmqtve/auth/providers
2. 找到 **GitLab** 提供商
3. 点击展开配置
4. 启用 **Enable Sign in with GitLab**
5. 粘贴 **Application ID** (作为 Client ID) 和 **Secret** (作为 Client Secret)
6. 点击 **Save**

---

## 3. Figma OAuth 配置

### 步骤 A: 在 Figma 创建 OAuth App

1. 访问 https://www.figma.com/developers/apps
2. 点击 **Create new app**
3. 填写以下信息:
   - **App name**: `定边职教`
   - **Website URL**: `http://localhost:3000`
   - **Callback URL**: `https://jfmtjvitsrfxoitmqtve.supabase.co/auth/v1/callback`
4. 创建后,复制 **Client ID** 和 **Client Secret**

### 步骤 B: 在 Supabase 配置 Figma

1. 访问 https://supabase.com/dashboard/project/jfmtjvitsrfxoitmqtve/auth/providers
2. 找到 **Figma** 提供商
3. 点击展开配置
4. 启用 **Enable Sign in with Figma**
5. 粘贴 **Client ID** 和 **Client Secret**
6. 点击 **Save**

---

## 快速访问链接

- **Supabase Auth Providers**: https://supabase.com/dashboard/project/jfmtjvitsrfxoitmqtve/auth/providers
- **GitHub OAuth Apps**: https://github.com/settings/developers
- **GitLab Applications**: https://gitlab.com/-/profile/applications
- **Figma Developers**: https://www.figma.com/developers/apps

---

## 测试 OAuth 登录

配置完成后:

1. 确保开发服务器正在运行: `npm run dev`
2. 访问登录页面: http://localhost:3000/login
3. 点击任意第三方登录按钮
4. 应该会重定向到相应的 OAuth 提供商授权页面
5. 授权后会重定向回您的应用并自动登录

---

## 常见问题

### Q: 点击 OAuth 按钮没有反应?
**A**: 检查浏览器控制台是否有错误,确保环境变量已正确配置。

### Q: 重定向后显示错误?
**A**: 确保 Callback URL 在 OAuth 应用和 Supabase 中都配置正确。

### Q: 提示 "OAuth provider not configured"?
**A**: 在 Supabase Dashboard 中启用并保存相应的 OAuth 提供商配置。

---

## 生产环境配置

部署到生产环境时,需要更新:

1. **GitHub/GitLab/Figma OAuth App**:
   - 更新 Homepage URL 为生产域名
   - 更新 Callback URL 为生产域名

2. **Supabase**:
   - 在 Authentication > URL Configuration 中添加生产域名到 Site URL
   - 在 Redirect URLs 中添加生产域名
