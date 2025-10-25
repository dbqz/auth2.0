# 跨域认证使用指南

## 概述

本系统支持主域名下其他网站的跨域认证。其他网站可以通过简单的 JavaScript SDK 集成认证功能。

## 快速开始

### 1. 引入认证 SDK

```html
<script src="http://your-auth-domain.com/auth-sdk.js"></script>
```

### 2. 初始化认证

```javascript
const auth = new DingbianAuthSDK({
  authDomain: 'http://your-auth-domain.com',  // 认证服务域名
  siteName: '您的网站名称',                    // 可选，用于显示
  onSuccess: (user) => {
    console.log('登录成功:', user)
    // 处理登录成功逻辑
  },
  onError: (error) => {
    console.error('认证失败:', error)
    // 处理认证失败逻辑
  }
})
```

### 3. 基本使用

```javascript
// 检查用户是否已登录
const authStatus = await auth.checkAuth()
if (authStatus.authenticated) {
  console.log('用户已登录:', authStatus.user)
}

// 启动登录流程
auth.login({
  redirectTo: 'http://your-site.com/dashboard',  // 登录后重定向的URL
  siteName: '您的网站名称'                        // 可选
})

// 退出登录
await auth.logout()

// 获取用户信息
const user = await auth.getUser()
```

## API 参考

### DingbianAuthSDK 构造函数

```javascript
new DingbianAuthSDK(config)
```

**参数:**
- `config.authDomain` (string): 认证服务域名
- `config.siteName` (string, 可选): 网站名称
- `config.onSuccess` (function, 可选): 成功回调函数
- `config.onError` (function, 可选): 错误回调函数

### 方法

#### `checkAuth()`
检查用户认证状态

**返回值:**
```javascript
{
  authenticated: boolean,
  user: {
    id: string,
    email: string,
    name: string,
    avatar?: string,
    provider?: string
  } | null
}
```

#### `login(options)`
启动登录流程

**参数:**
- `options.redirectTo` (string): 登录后重定向的URL
- `options.siteName` (string, 可选): 网站名称

**返回值:** 弹出窗口对象

#### `logout()`
退出登录

#### `getUser()`
获取当前用户信息

**返回值:** 用户对象或 null

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>跨域认证示例</title>
    <script src="http://your-auth-domain.com/auth-sdk.js"></script>
</head>
<body>
    <div id="app">
        <div id="login-section" style="display: none;">
            <h2>请登录</h2>
            <button onclick="handleLogin()">登录</button>
        </div>
        
        <div id="user-section" style="display: none;">
            <h2>欢迎, <span id="user-name"></span></h2>
            <p>邮箱: <span id="user-email"></span></p>
            <button onclick="handleLogout()">退出登录</button>
        </div>
    </div>

    <script>
        let auth;

        // 初始化认证
        function initAuth() {
            auth = new DingbianAuthSDK({
                authDomain: 'http://your-auth-domain.com',
                siteName: '示例网站',
                onSuccess: (user) => {
                    if (user) {
                        showUserSection(user);
                    } else {
                        showLoginSection();
                    }
                },
                onError: (error) => {
                    alert('认证失败: ' + error.message);
                }
            });
        }

        // 检查认证状态
        async function checkAuth() {
            const result = await auth.checkAuth();
            if (result.authenticated) {
                showUserSection(result.user);
            } else {
                showLoginSection();
            }
        }

        // 显示登录区域
        function showLoginSection() {
            document.getElementById('login-section').style.display = 'block';
            document.getElementById('user-section').style.display = 'none';
        }

        // 显示用户区域
        function showUserSection(user) {
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('user-section').style.display = 'block';
        }

        // 处理登录
        function handleLogin() {
            auth.login({
                redirectTo: window.location.href,
                siteName: '示例网站'
            });
        }

        // 处理退出登录
        async function handleLogout() {
            await auth.logout();
        }

        // 页面加载时初始化
        window.onload = function() {
            initAuth();
            checkAuth();
        };
    </script>
</body>
</html>
```

## 安全注意事项

1. **域名验证**: 确保只有主域名下的网站才能使用认证服务
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **CORS 配置**: 正确配置跨域资源共享
4. **会话管理**: 定期检查会话有效性

## 故障排除

### 常见问题

1. **认证窗口无法打开**
   - 检查浏览器弹窗拦截设置
   - 确保认证域名可访问

2. **登录后状态未更新**
   - 检查 `onSuccess` 回调函数
   - 确认重定向URL正确

3. **跨域请求失败**
   - 检查 CORS 配置
   - 确认认证域名设置正确

### 调试技巧

```javascript
// 启用调试模式
const auth = new DingbianAuthSDK({
  authDomain: 'http://your-auth-domain.com',
  onSuccess: (user) => console.log('认证成功:', user),
  onError: (error) => console.error('认证失败:', error)
});

// 手动检查认证状态
auth.checkAuth().then(result => {
  console.log('认证状态:', result);
});
```

## 支持的功能

- ✅ 邮箱密码登录
- ✅ GitHub OAuth 登录
- ✅ GitLab OAuth 登录
- ✅ 用户信息获取
- ✅ 退出登录
- ✅ 认证状态检查
- ✅ 跨域重定向
- ✅ 弹出窗口登录
