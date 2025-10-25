# 定边职教 OAuth2 登录系统设置指南

## 环境变量配置

在项目根目录创建 `.env.local` 文件,添加以下环境变量:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 获取 Supabase 凭据

1. 访问 [Supabase Dashboard](https://app.supabase.com/)
2. 选择或创建您的项目
3. 进入 **Settings** > **API**
4. 复制 **Project URL** 和 **anon/public key**

## OAuth2 提供商配置

### 1. GitHub OAuth

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写信息:
   - **Application name**: 定边职教
   - **Homepage URL**: `http://localhost:3000` (开发环境)
   - **Authorization callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
4. 获取 **Client ID** 和 **Client Secret**
5. 在 Supabase Dashboard 中:
   - 进入 **Authentication** > **Providers**
   - 启用 **GitHub**
   - 输入 Client ID 和 Client Secret

### 2. GitLab OAuth

1. 访问 [GitLab Applications](https://gitlab.com/-/profile/applications)
2. 创建新应用:
   - **Name**: 定边职教
   - **Redirect URI**: `https://your-project-ref.supabase.co/auth/v1/callback`
   - **Scopes**: 勾选 `read_user`
3. 获取 **Application ID** 和 **Secret**
4. 在 Supabase Dashboard 中:
   - 进入 **Authentication** > **Providers**
   - 启用 **GitLab**
   - 输入 Application ID 和 Secret

### 3. Figma OAuth

1. 访问 [Figma Developers](https://www.figma.com/developers/apps)
2. 创建新应用:
   - **App name**: 定边职教
   - **Redirect URI**: `https://your-project-ref.supabase.co/auth/v1/callback`
3. 获取 **Client ID** 和 **Client Secret**
4. 在 Supabase Dashboard 中:
   - 进入 **Authentication** > **Providers**
   - 启用 **Figma**
   - 输入 Client ID 和 Client Secret

## 邮箱密码认证配置

在 Supabase Dashboard 中:
1. 进入 **Authentication** > **Providers**
2. 确保 **Email** 提供商已启用
3. 配置邮件模板(可选)

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000/login` 查看登录页面

## 功能特性

✅ 邮箱密码登录  
✅ GitHub OAuth2 登录  
✅ GitLab OAuth2 登录  
✅ Figma OAuth2 登录  
✅ 错误处理和验证  
✅ 加载状态显示  
✅ 会话管理  
✅ 自动重定向

## 需求文档对照

### 需求 1: 邮箱密码登录 ✅
- ✅ 显示邮箱输入字段
- ✅ 显示密码输入字段
- ✅ 验证凭据并创建会话
- ✅ 显示错误消息
- ✅ 密码字段隐藏字符

### 需求 2: 第三方 OAuth2 登录 ✅
- ✅ Figma OAuth2 登录按钮
- ✅ GitHub OAuth2 登录按钮
- ✅ GitLab OAuth2 登录按钮
- ✅ 重定向到 OAuth2 Provider
- ✅ 创建或更新用户会话

### 需求 3: Supabase 集成 ✅
- ✅ 使用 Supabase Authentication
- ✅ 存储用户数据在 Supabase
- ✅ 管理 OAuth2 Provider 配置
