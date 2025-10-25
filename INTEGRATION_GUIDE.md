# 定边职教认证系统 - 完整集成指南

## 概述

本认证系统支持跨域登录，其他网站可以通过简单的 URL 参数或 JavaScript SDK 集成认证功能。用户登录后会自动重定向回原网站。

## 方式一：URL 参数集成（推荐）

### 基本用法

在您的网站中，将用户重定向到认证系统的登录页面，并添加 `wz` 参数指定登录后的跳转地址：

```html
<a href="http://your-auth-domain.com/login?wz=https://qzwb.asia">
  登录
</a>
```

### URL 参数说明

- `wz`: 登录成功后的重定向地址（必须 URL 编码）
- `site_name`: 网站名称（可选，用于显示）

### 完整示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>我的网站</title>
</head>
<body>
    <div id="app">
        <h1>欢迎访问我的网站</h1>
        
        <!-- 登录按钮 -->
        <a href="http://your-auth-domain.com/login?wz=https://qzwb.asia/dashboard" 
           class="login-btn">
            使用定边职教账号登录
        </a>
        
        <!-- 带网站名称的登录 -->
        <a href="http://your-auth-domain.com/login?wz=https://qzwb.asia/dashboard&site_name=我的网站" 
           class="login-btn">
            登录到我的网站
        </a>
    </div>
</body>
</html>
```

### 处理登录结果

登录成功后，用户会重定向回您的网站。您可以通过以下方式处理：

```javascript
// 检查 URL 参数，确认登录成功
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('auth_success') === 'true') {
    const userId = urlParams.get('user_id');
    const userEmail = urlParams.get('user_email');
    const accessToken = urlParams.get('access_token');
    
    console.log('登录成功:', {
        userId,
        userEmail,
        accessToken
    });
    
    // 保存用户信息到本地存储
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_email', userEmail);
    localStorage.setItem('access_token', accessToken);
    
    // 更新页面显示
    updateUserInterface(userEmail);
}
```

## 方式二：JavaScript SDK 集成

### 1. 引入 SDK

```html
<script src="http://your-auth-domain.com/auth-sdk.js"></script>
```

### 2. 初始化认证

```javascript
const auth = new DingbianAuthSDK({
    authDomain: 'http://your-auth-domain.com',
    siteName: '您的网站名称',
    onSuccess: (user) => {
        console.log('登录成功:', user);
        // 处理登录成功
        updateUserInterface(user);
    },
    onError: (error) => {
        console.error('认证失败:', error);
        alert('登录失败: ' + error.message);
    }
});
```

### 3. 基本使用

```javascript
// 检查用户是否已登录
async function checkLoginStatus() {
    const status = await auth.checkAuth();
    if (status.authenticated) {
        console.log('用户已登录:', status.user);
        updateUserInterface(status.user);
    } else {
        showLoginButton();
    }
}

// 启动登录
function startLogin() {
    auth.login({
        redirectTo: window.location.href,
        siteName: '您的网站名称'
    });
}

// 退出登录
async function logout() {
    await auth.logout();
    showLoginButton();
}
```

## 方式三：API 集成

### 检查认证状态

```javascript
async function checkAuthStatus() {
    try {
        const response = await fetch('http://your-auth-domain.com/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
            console.log('用户已登录:', data.user);
            return data.user;
        } else {
            console.log('用户未登录');
            return null;
        }
    } catch (error) {
        console.error('检查认证状态失败:', error);
        return null;
    }
}
```

### 获取用户信息

```javascript
async function getUserInfo() {
    try {
        const response = await fetch('http://your-auth-domain.com/api/auth/user');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}
```

## 完整集成示例

### HTML 页面示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的网站</title>
    <style>
        .login-section { display: block; }
        .user-section { display: none; }
        .user-section.show { display: block; }
        .login-section.hide { display: none; }
    </style>
</head>
<body>
    <div id="app">
        <!-- 未登录状态 -->
        <div id="login-section" class="login-section">
            <h1>欢迎访问我的网站</h1>
            <p>请登录以继续使用</p>
            <a href="http://your-auth-domain.com/login?wz=https://qzwb.asia/dashboard" 
               class="login-btn">
                使用定边职教账号登录
            </a>
        </div>
        
        <!-- 已登录状态 -->
        <div id="user-section" class="user-section">
            <h1>欢迎回来, <span id="user-name"></span>!</h1>
            <p>邮箱: <span id="user-email"></span></p>
            <button onclick="logout()">退出登录</button>
        </div>
    </div>

    <script>
        // 页面加载时检查登录状态
        window.onload = function() {
            checkLoginStatus();
        };

        // 检查登录状态
        function checkLoginStatus() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // 检查是否有登录成功的参数
            if (urlParams.get('auth_success') === 'true') {
                const userId = urlParams.get('user_id');
                const userEmail = urlParams.get('user_email');
                const accessToken = urlParams.get('access_token');
                
                // 保存用户信息
                localStorage.setItem('user_id', userId);
                localStorage.setItem('user_email', userEmail);
                localStorage.setItem('access_token', accessToken);
                
                // 更新界面
                showUserSection(userEmail);
                
                // 清理 URL 参数
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                // 检查本地存储的用户信息
                const userEmail = localStorage.getItem('user_email');
                if (userEmail) {
                    showUserSection(userEmail);
                } else {
                    showLoginSection();
                }
            }
        }

        // 显示登录区域
        function showLoginSection() {
            document.getElementById('login-section').classList.remove('hide');
            document.getElementById('user-section').classList.remove('show');
        }

        // 显示用户区域
        function showUserSection(userEmail) {
            document.getElementById('user-name').textContent = userEmail;
            document.getElementById('user-email').textContent = userEmail;
            document.getElementById('login-section').classList.add('hide');
            document.getElementById('user-section').classList.add('show');
        }

        // 退出登录
        function logout() {
            // 清除本地存储
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_email');
            localStorage.removeItem('access_token');
            
            // 重定向到认证系统退出
            window.location.href = 'http://your-auth-domain.com/api/auth/logout';
        }
    </script>
</body>
</html>
```

### React 组件示例

```jsx
import React, { useState, useEffect } from 'react';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('auth_success') === 'true') {
            const userData = {
                id: urlParams.get('user_id'),
                email: urlParams.get('user_email'),
                accessToken: urlParams.get('access_token')
            };
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 清理 URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        
        setLoading(false);
    };

    const handleLogin = () => {
        window.location.href = `http://your-auth-domain.com/login?wz=${encodeURIComponent(window.location.href)}`;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = 'http://your-auth-domain.com/api/auth/logout';
    };

    if (loading) {
        return <div>加载中...</div>;
    }

    return (
        <div>
            {user ? (
                <div>
                    <h1>欢迎回来, {user.email}!</h1>
                    <button onClick={handleLogout}>退出登录</button>
                </div>
            ) : (
                <div>
                    <h1>请登录</h1>
                    <button onClick={handleLogin}>登录</button>
                </div>
            )}
        </div>
    );
}

export default App;
```

### Vue.js 组件示例

```vue
<template>
  <div>
    <div v-if="!user">
      <h1>请登录</h1>
      <button @click="login">登录</button>
    </div>
    <div v-else>
      <h1>欢迎回来, {{ user.email }}!</h1>
      <button @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
    }
  },
  mounted() {
    this.checkAuthStatus();
  },
  methods: {
    checkAuthStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('auth_success') === 'true') {
        const userData = {
          id: urlParams.get('user_id'),
          email: urlParams.get('user_email'),
          accessToken: urlParams.get('access_token')
        };
        
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 清理 URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          this.user = JSON.parse(savedUser);
        }
      }
    },
    login() {
      window.location.href = `http://your-auth-domain.com/login?wz=${encodeURIComponent(window.location.href)}`;
    },
    logout() {
      localStorage.removeItem('user');
      this.user = null;
      window.location.href = 'http://your-auth-domain.com/api/auth/logout';
    }
  }
}
</script>
```

## 支持的登录方式

- ✅ **邮箱密码登录**
- ✅ **GitHub OAuth 登录**
- ✅ **GitLab OAuth 登录**
- ✅ **自动重定向**
- ✅ **跨域支持**

## 安全注意事项

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **域名验证**: 确保重定向 URL 的安全性
3. **参数验证**: 验证 URL 参数的有效性
4. **会话管理**: 定期检查用户会话状态

## 故障排除

### 常见问题

1. **登录后没有重定向**
   - 检查 `wz` 参数是否正确编码
   - 确认目标 URL 是有效的

2. **跨域请求失败**
   - 检查 CORS 配置
   - 确认认证域名设置正确

3. **用户信息丢失**
   - 检查本地存储是否被清除
   - 确认会话是否过期

### 调试技巧

```javascript
// 启用调试模式
console.log('当前 URL:', window.location.href);
console.log('URL 参数:', new URLSearchParams(window.location.search));
console.log('本地存储:', localStorage.getItem('user'));
```

## 测试方法

1. **本地测试**
   ```bash
   # 启动认证服务
   npm run dev
   
   # 访问测试页面
   http://localhost:3000/login?wz=http://localhost:3001/dashboard
   ```

2. **生产环境测试**
   ```bash
   # 确保 HTTPS 配置正确
   # 测试跨域重定向
   # 验证用户信息传递
   ```

## 联系支持

如有问题，请联系技术支持团队。
