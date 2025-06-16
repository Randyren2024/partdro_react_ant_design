# 语言切换功能改进文档

## 概述

本文档记录了对 partdro 网站语言切换功能的改进，包括错误处理、日志记录、环境检测和统一的语言切换策略。

## 改进内容

### 1. 环境检测工具 (`src/utils/environmentUtils.ts`)

新增了环境检测和日志记录工具函数：

- `isLocalEnvironment()`: 检测是否为本地开发环境
- `isProductionEnvironment()`: 检测是否为生产环境
- `isDevelopmentEnvironment()`: 检测是否为开发环境
- `getEnvironmentType()`: 获取当前环境类型
- `logLanguageChange()`: 记录语言切换日志
- `logError()`: 记录错误日志
- `safeRedirect()`: 安全的重定向函数
- `getEnvironmentConfig()`: 获取环境相关配置

### 2. 语言工具函数改进 (`src/utils/languageUtils.ts`)

对所有语言相关函数添加了错误处理：

- `getLanguageFromSubdomain()`: 添加了错误处理
- `getCurrentLanguage()`: 添加了错误处理和回退机制
- `buildLanguageUrl()`: 添加了错误处理和回退URL
- `redirectToLanguage()`: 使用安全重定向函数
- `shouldRedirectToWww()`: 添加了错误处理
- `getWwwUrl()`: 添加了错误处理
- `subdomainLanguageDetector`: 添加了错误处理
- `switchLanguage()`: 新增统一的语言切换策略

### 3. Header 组件改进 (`src/components/Layout/Header.tsx`)

简化了语言切换逻辑：

- 使用统一的 `switchLanguage()` 函数
- 添加了成功和失败的回调处理
- 改进了错误处理和日志记录
- 提供了多层回退机制

## 功能特性

### 错误处理

- **多层回退机制**: 如果子域名重定向失败，会自动回退到客户端语言切换
- **安全重定向**: 验证URL格式，防止恶意重定向
- **错误日志**: 详细记录错误信息，便于调试

### 日志记录

- **语言切换日志**: 记录语言切换的来源、目标和方法
- **环境感知**: 根据不同环境调整日志级别
- **分析集成**: 预留了 Google Analytics 和 Sentry 集成接口

### 环境检测

- **自动检测**: 自动识别本地、开发和生产环境
- **统一配置**: 提供环境相关的配置信息
- **灵活扩展**: 支持添加新的环境类型

## 使用方法

### 基本语言切换

```typescript
import { switchLanguage } from '../utils/languageUtils';

// 简单切换
switchLanguage('es');

// 带回调的切换
switchLanguage('es', {
  onSuccess: () => console.log('Language switched successfully'),
  onError: (error) => console.error('Language switch failed:', error),
  fallbackToClientSide: true
});
```

### 环境检测

```typescript
import { getEnvironmentType, isLocalEnvironment } from '../utils/environmentUtils';

const env = getEnvironmentType(); // 'local' | 'development' | 'production'
const isLocal = isLocalEnvironment(); // boolean
```

### 错误处理

```typescript
import { logError, safeRedirect } from '../utils/environmentUtils';

// 记录错误
try {
  // 一些操作
} catch (error) {
  logError(error, 'Operation context');
}

// 安全重定向
safeRedirect('https://example.com', () => {
  console.log('Redirect failed, executing fallback');
});
```

## 配置选项

### 环境配置

`getEnvironmentConfig()` 返回的配置对象包含：

```typescript
{
  environment: 'local' | 'development' | 'production',
  isLocal: boolean,
  isDevelopment: boolean,
  isProduction: boolean,
  enableLogging: boolean,
  enableDebug: boolean,
  apiBaseUrl: string
}
```

### 语言切换选项

`switchLanguage()` 支持的选项：

```typescript
{
  fallbackToClientSide?: boolean; // 是否启用客户端回退，默认 true
  onSuccess?: () => void;         // 成功回调
  onError?: (error: Error) => void; // 错误回调
}
```

## 部署注意事项

1. **DNS 配置**: 确保所有语言子域名都正确配置
2. **SSL 证书**: 确保所有子域名都有有效的SSL证书
3. **CDN 配置**: 如果使用CDN，确保所有子域名都正确配置
4. **监控**: 建议配置错误监控服务（如 Sentry）
5. **分析**: 建议配置分析服务（如 Google Analytics）

## 测试

### 本地测试

```bash
# 启动开发服务器
npm run dev

# 测试不同语言
http://localhost:3000?lang=es
http://localhost:3000?lang=de
```

### 生产测试

```bash
# 构建项目
npm run build

# 测试不同子域名
https://es.partdro.com
https://de.partdro.com
```

## 故障排除

### 常见问题

1. **子域名重定向失败**
   - 检查DNS配置
   - 检查SSL证书
   - 查看浏览器控制台错误日志

2. **客户端回退不工作**
   - 检查i18n配置
   - 检查localStorage权限
   - 查看错误日志

3. **日志不显示**
   - 检查环境配置
   - 检查浏览器控制台设置
   - 确认日志级别配置

### 调试技巧

1. 打开浏览器开发者工具
2. 查看控制台日志
3. 检查网络请求
4. 验证localStorage内容
5. 测试不同环境下的行为

## 未来改进

1. **性能优化**: 缓存语言检测结果
2. **用户体验**: 添加语言切换动画
3. **分析增强**: 更详细的用户行为分析
4. **A/B测试**: 支持不同语言切换策略的A/B测试
5. **自动检测**: 基于用户地理位置的自动语言检测

## 版本历史

- **v1.0.0**: 初始版本，基本语言切换功能
- **v1.1.0**: 添加错误处理和日志记录
- **v1.2.0**: 统一语言切换策略和环境检测
- **v1.3.0**: 当前版本，完整的错误处理和回退机制