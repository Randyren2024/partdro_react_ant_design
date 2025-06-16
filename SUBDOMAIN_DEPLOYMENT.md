# WWW域名重定向部署指南

本项目已配置将所有子域名重定向到 `www.partdro.com` 主域名，并在单一域名下支持多语种切换。

## 域名结构

- `www.partdro.com` - 主域名，支持所有语言
- 所有语言子域名将重定向到主域名
- 主域名 `partdro.com` 也将重定向到 `www.partdro.com`

## Cloudflare Pages 配置步骤

### 1. DNS 配置

在 Cloudflare DNS 中添加以下记录：

```
类型: CNAME
名称: www
内容: partdro-react-design.pages.dev
代理状态: 已代理 (橙色云朵)

类型: A
名称: @
内容: 192.0.2.1 (或使用 CNAME 指向 www)
代理状态: 已代理 (橙色云朵)
```

注意：主域名 `@` 记录可以使用 A 记录或 CNAME 记录，但如果使用 CNAME，需要确保 Cloudflare 支持根域名 CNAME 扁平化。

### 2. Cloudflare Pages 设置

1. 在 Cloudflare Pages 控制台中，进入你的项目设置
2. 转到 "Custom domains" 部分
3. 添加以下自定义域名：
   - `www.partdro.com`
   - `partdro.com` (可选，用于重定向到 www)

每个域名添加后，Cloudflare 会自动验证并配置 SSL 证书。

### 3. 重定向规则

项目包含两个重要的配置文件：

#### `public/_redirects`
这个文件处理基本的重定向规则：
- 将所有子域名重定向到 www 主域名
- 为 SPA 应用配置 fallback 路由

#### `functions/[[path]].ts`
这个 Cloudflare Functions 文件处理域名重定向逻辑：
- 检测当前域名是否为 www 子域名
- 将主域名重定向到 www 子域名
- 将其他子域名重定向到 www 子域名

## 本地开发

在本地开发环境中，域名重定向功能会被自动禁用，语言切换将使用标准的 i18next 方式。

```bash
npm run dev
```

访问 `http://localhost:5173` 进行开发和测试。

## 功能特性

### 域名统一管理
- 所有访问统一重定向到 www.partdro.com
- 避免重复内容和SEO问题
- 简化域名管理和维护

### SEO 优化
- 统一的 canonical URL 指向 www 域名
- 避免子域名分散权重
- 搜索引擎友好的单一域名结构

### 用户体验
- 一致的域名访问体验
- 在单一域名下支持多语种切换
- 快速的域名重定向

## 测试

部署完成后，可以测试以下场景：

1. **主域名访问**
   - `https://partdro.com` - 应重定向到 `https://www.partdro.com`

2. **www域名访问**
   - `https://www.partdro.com` - 应正常显示网站内容

3. **子域名重定向**
   - `https://en.partdro.com` - 应重定向到 `https://www.partdro.com`
   - `https://es.partdro.com` - 应重定向到 `https://www.partdro.com`
   - `https://any.partdro.com` - 应重定向到 `https://www.partdro.com`

4. **语言切换功能**
   - 在 www.partdro.com 上切换语言应正常工作
   - 保持在同一域名下

## 故障排除

### www域名无法访问
1. 检查 DNS 记录是否正确配置
2. 确认 Cloudflare Pages 自定义域名设置
3. 检查 SSL 证书状态

### 重定向不工作
1. 检查 `public/_redirects` 文件是否正确部署
2. 确认 `functions/[[path]].ts` 文件存在
3. 查看 Cloudflare Pages 部署日志
4. 验证重定向规则是否指向 www 域名

### 语言切换问题
1. 检查浏览器控制台是否有错误
2. 确认 `languageUtils.ts` 中的域名配置
3. 验证 i18n 配置是否正确
4. 确保在 www 域名下语言切换正常工作

### 调试

在浏览器控制台中运行以下代码来调试：

```javascript
// 检查当前语言检测
console.log('Current language:', window.getCurrentLanguage());

// 检查是否需要重定向
console.log('Should redirect:', window.shouldRedirectToLanguageSubdomain());

// 测试语言URL构建
console.log('Spanish URL:', window.buildLanguageUrl('es', '/products'));
```

### 调试

在浏览器控制台中运行以下代码来调试：

```javascript
// 检查当前语言检测
console.log('Current language:', window.getCurrentLanguage());

// 检查是否需要重定向
console.log('Should redirect:', window.shouldRedirectToLanguageSubdomain());

// 测试语言URL构建
console.log('Spanish URL:', window.buildLanguageUrl('es', '/products'));
```

可以通过以下方式调试问题：

1. **查看 Cloudflare Pages 日志**
   - 在 Cloudflare Pages 控制台查看部署和函数日志

2. **本地测试**
   - 使用 `npm run dev` 在本地测试语言切换功能

3. **网络工具**
   - 使用浏览器开发者工具查看网络请求
   - 检查重定向响应状态码

## 更新语言支持

要添加新的语言支持：

1. 在 `src/utils/languageUtils.ts` 中更新 `SUPPORTED_LANGUAGES` 数组
2. 在 `src/i18n/locales/` 中添加新的语言文件
3. 更新语言配置和相关组件
4. 重新部署应用

## 注意事项

- 确保 www 域名有有效的 SSL 证书
- 定期检查重定向规则是否正常工作
- 监控 Cloudflare Pages 的使用量和性能
- 考虑 CDN 缓存对重定向的影响
- 所有子域名访问都会重定向到 www 主域名