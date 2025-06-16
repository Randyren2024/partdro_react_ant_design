/**
 * 环境检测和日志记录工具函数
 */

/**
 * 检测是否为本地开发环境
 * @returns 是否为本地环境
 */
export function isLocalEnvironment(): boolean {
  const { hostname } = window.location;
  return hostname === 'localhost' || 
         hostname.startsWith('127.0.0.1') || 
         hostname.startsWith('192.168.') ||
         hostname.endsWith('.local');
}

/**
 * 检测是否为生产环境
 * @returns 是否为生产环境
 */
export function isProductionEnvironment(): boolean {
  return !isLocalEnvironment() && !isDevelopmentEnvironment();
}

/**
 * 检测是否为开发环境（非本地但也非生产）
 * @returns 是否为开发环境
 */
export function isDevelopmentEnvironment(): boolean {
  const { hostname } = window.location;
  return hostname.includes('dev') || 
         hostname.includes('staging') || 
         hostname.includes('test');
}

/**
 * 获取当前环境类型
 * @returns 环境类型字符串
 */
export function getEnvironmentType(): 'local' | 'development' | 'production' {
  if (isLocalEnvironment()) return 'local';
  if (isDevelopmentEnvironment()) return 'development';
  return 'production';
}

/**
 * 记录语言切换日志
 * @param fromLanguage - 原语言
 * @param toLanguage - 目标语言
 * @param method - 切换方法
 */
export function logLanguageChange(
  fromLanguage: string, 
  toLanguage: string, 
  method: 'subdomain' | 'url_param' | 'client_side'
): void {
  const environment = getEnvironmentType();
  const timestamp = new Date().toISOString();
  
  console.log(`[Language Change] ${timestamp}`, {
    environment,
    from: fromLanguage,
    to: toLanguage,
    method,
    url: window.location.href
  });
  
  // 在生产环境中，可以发送到分析服务
  if (environment === 'production') {
    // 这里可以添加发送到 Google Analytics 或其他分析服务的代码
    // gtag('event', 'language_change', { from: fromLanguage, to: toLanguage, method });
  }
}

/**
 * 记录错误日志
 * @param error - 错误对象
 * @param context - 错误上下文
 */
export function logError(error: Error, context: string): void {
  const environment = getEnvironmentType();
  const timestamp = new Date().toISOString();
  
  console.error(`[Error] ${timestamp} - ${context}`, {
    environment,
    message: error.message,
    stack: error.stack,
    url: window.location.href
  });
  
  // 在生产环境中，可以发送到错误监控服务
  if (environment === 'production') {
    // 这里可以添加发送到 Sentry 或其他错误监控服务的代码
    // Sentry.captureException(error, { extra: { context } });
  }
}

/**
 * 安全的重定向函数，包含错误处理
 * @param url - 目标URL
 * @param fallbackAction - 失败时的回调函数
 */
export function safeRedirect(url: string, fallbackAction?: () => void): void {
  try {
    // 验证URL格式
    new URL(url);
    
    // 记录重定向日志
    console.log(`[Redirect] Navigating to: ${url}`);
    
    // 执行重定向
    window.location.href = url;
  } catch (error) {
    logError(error as Error, `Failed to redirect to: ${url}`);
    
    // 执行回调函数
    if (fallbackAction) {
      try {
        fallbackAction();
      } catch (fallbackError) {
        logError(fallbackError as Error, 'Fallback action failed');
      }
    }
  }
}

/**
 * 获取环境配置
 * @returns 环境相关配置
 */
export function getEnvironmentConfig() {
  const environment = getEnvironmentType();
  
  return {
    environment,
    isLocal: environment === 'local',
    isDevelopment: environment === 'development',
    isProduction: environment === 'production',
    enableLogging: environment !== 'production', // 生产环境可能需要关闭详细日志
    enableDebug: environment === 'local',
    apiBaseUrl: environment === 'production' 
      ? 'https://api.partdro.com' 
      : environment === 'development'
      ? 'https://dev-api.partdro.com'
      : 'http://localhost:3001'
  };
}