// 支持的语言列表
export const SUPPORTED_LANGUAGES = ['en', 'es', 'de', 'ja', 'ko', 'th', 'pt', 'it', 'fr'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

import { isLocalEnvironment, logError, safeRedirect } from './environmentUtils';

// 语言配置
export const LANGUAGE_CONFIG = {
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  de: { name: 'German', nativeName: 'Deutsch' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  ko: { name: 'Korean', nativeName: '한국어' },
  th: { name: 'Thai', nativeName: 'ไทย' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  it: { name: 'Italian', nativeName: 'Italiano' },
  fr: { name: 'French', nativeName: 'Français' },
} as const;

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * 从子域名中提取语言代码
 * @param hostname - 主机名 (如: en.partdro.com)
 * @returns 语言代码或null
 */
export function getLanguageFromSubdomain(hostname: string): SupportedLanguage | null {
  // 处理本地开发环境
  if (isLocalEnvironment()) {
    return null;
  }

  try {
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      if (SUPPORTED_LANGUAGES.includes(subdomain as SupportedLanguage)) {
        return subdomain as SupportedLanguage;
      }
    }
    return null;
  } catch (error) {
    logError(error as Error, `Failed to extract language from subdomain: ${hostname}`);
    return null;
  }
}

/**
 * 获取当前语言
 * @returns 当前语言代码
 */
export function getCurrentLanguage(): SupportedLanguage {
  try {
    const { hostname, search } = window.location;
    
    // 本地开发环境：从URL参数获取语言
    if (isLocalEnvironment()) {
      const urlParams = new URLSearchParams(search);
      const langParam = urlParams.get('lang');
      if (langParam && SUPPORTED_LANGUAGES.includes(langParam as SupportedLanguage)) {
        return langParam as SupportedLanguage;
      }
      
      // 如果URL参数中没有语言，尝试从localStorage获取
      const cachedLang = localStorage.getItem('i18nextLng');
      if (cachedLang && SUPPORTED_LANGUAGES.includes(cachedLang as SupportedLanguage)) {
        return cachedLang as SupportedLanguage;
      }
      
      return DEFAULT_LANGUAGE;
    }
    
    // 生产环境：从子域名获取语言
    const subdomainLang = getLanguageFromSubdomain(hostname);
    return subdomainLang || DEFAULT_LANGUAGE;
  } catch (error) {
    logError(error as Error, 'Failed to get current language');
    return DEFAULT_LANGUAGE;
  }
}

/**
 * 构建语言URL
 * @param language - 目标语言
 * @param path - 路径 (可选)
 * @returns 完整的URL
 */
export function buildLanguageUrl(language: SupportedLanguage, path: string = ''): string {
  try {
    const { hostname, protocol, port, pathname, search } = window.location;
    
    // 本地开发环境：使用URL参数
    if (isLocalEnvironment()) {
      const targetPath = path || pathname;
      const urlParams = new URLSearchParams(search);
      urlParams.set('lang', language);
      return `${protocol}//${hostname}${port ? `:${port}` : ''}${targetPath}?${urlParams.toString()}`;
    }

    // 生产环境：构建子域名URL
    const parts = hostname.split('.');
    let newHostname: string;
    
    if (parts.length >= 3) {
      // 已有子域名，替换第一个部分
      parts[0] = language;
      newHostname = parts.join('.');
    } else {
      // 没有子域名，添加语言子域名
      newHostname = `${language}.${hostname}`;
    }

    return `${protocol}//${newHostname}${path}`;
  } catch (error) {
    logError(error as Error, `Failed to build language URL for language: ${language}`);
    // 回退到当前URL
    return window.location.href;
  }
}

/**
 * 重定向到指定语言的子域名
 * @param language - 目标语言
 * @param path - 路径 (可选，默认为当前路径)
 */
export function redirectToLanguage(language: SupportedLanguage, path?: string): void {
  try {
    const targetPath = path || window.location.pathname + window.location.search;
    const url = buildLanguageUrl(language, targetPath);
    
    // 使用安全重定向函数，包含错误处理
    safeRedirect(url, () => {
      // 回退方案：使用客户端语言切换
      console.warn(`Failed to redirect to ${url}, falling back to client-side language change`);
      if (typeof window !== 'undefined' && window.i18n) {
        window.i18n.changeLanguage(language);
        localStorage.setItem('i18nextLng', language);
      }
    });
  } catch (error) {
    logError(error as Error, `Failed to redirect to language: ${language}`);
  }
}

/**
 * 检查是否需要重定向到www域名
 * @returns 是否需要重定向
 */
export function shouldRedirectToWww(): boolean {
  try {
    const { hostname } = window.location;
    
    // 本地开发环境不重定向
    if (isLocalEnvironment()) {
      return false;
    }

    // 如果已经在www域名上，不需要重定向
    if (hostname.startsWith('www.')) {
      return false;
    }

    // 如果是英文子域名，需要重定向到www（因为英文是默认语言）
    const currentLang = getLanguageFromSubdomain(hostname);
    if (currentLang === 'en') {
      return true;
    }
    
    // 如果是其他语言子域名，不重定向（保持语言子域名）
    if (currentLang && SUPPORTED_LANGUAGES.includes(currentLang)) {
      return false;
    }

    // 如果是主域名（没有子域名），需要重定向到www
    const parts = hostname.split('.');
    if (parts.length === 2) {
      return true;
    }

    return false;
  } catch (error) {
    logError(error as Error, 'Failed to check if should redirect to www');
    return false;
  }
}

/**
 * 获取浏览器首选语言对应的支持语言
 * @returns 支持的语言代码
 */
export function getBrowserPreferredLanguage(): SupportedLanguage {
  const browserLang = navigator.language.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage) 
    ? browserLang as SupportedLanguage 
    : DEFAULT_LANGUAGE;
}

/**
 * 获取主域名的www版本URL
 * @param path - 路径 (可选)
 * @returns www域名的完整URL
 */
export function getWwwUrl(path: string = ''): string {
  try {
    const { protocol, hostname } = window.location;
    
    // 本地开发环境处理
    if (isLocalEnvironment()) {
      return `${protocol}//${hostname}${path}`;
    }

    // 生产环境：构建www URL
    const parts = hostname.split('.');
    let newHostname: string;
    
    if (parts.length >= 3) {
      // 有子域名，替换为www
      parts[0] = 'www';
      newHostname = parts.join('.');
    } else {
      // 没有子域名，添加www
      newHostname = `www.${hostname}`;
    }

    return `${protocol}//${newHostname}${path}`;
  } catch (error) {
    logError(error as Error, `Failed to build www URL for path: ${path}`);
    return window.location.href;
  }
}

/**
 * 自定义语言检测器，用于i18next
 */
export const subdomainLanguageDetector = {
  name: 'subdomainDetector',
  lookup(): string {
    try {
      return getCurrentLanguage();
    } catch (error) {
      logError(error as Error, 'Failed to lookup language in detector');
      return DEFAULT_LANGUAGE;
    }
  },
  cacheUserLanguage(language: string): void {
    try {
      // 本地开发环境：缓存到localStorage
      if (isLocalEnvironment()) {
        localStorage.setItem('i18nextLng', language);
      }
      // 生产环境：子域名方案不需要缓存到localStorage
    } catch (error) {
      logError(error as Error, `Failed to cache language: ${language}`);
    }
  }
};

/**
 * 记录语言变更日志
 * @param fromLanguage - 原语言
 * @param toLanguage - 目标语言
 * @param method - 切换方法
 */
export function logLanguageChange(
  fromLanguage: SupportedLanguage,
  toLanguage: SupportedLanguage,
  method: 'subdomain' | 'client' | 'url_param' = 'subdomain'
): void {
  try {
    const logData = {
      timestamp: new Date().toISOString(),
      fromLanguage,
      toLanguage,
      method,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      isLocalEnvironment: isLocalEnvironment()
    };
    
    console.log('Language change:', logData);
    
    // 在生产环境中，可以发送到分析服务
    if (!isLocalEnvironment()) {
      // 这里可以添加发送到分析服务的代码
      // 例如: analytics.track('language_change', logData);
    }
  } catch (error) {
    logError(error as Error, `Failed to log language change from ${fromLanguage} to ${toLanguage}`);
  }
}

/**
 * 统一的语言切换策略
 * @param language - 目标语言
 * @param options - 选项
 */
export function switchLanguage(
  language: SupportedLanguage, 
  options: {
    fallbackToClientSide?: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): void {
  const { fallbackToClientSide = true, onSuccess, onError } = options;
  
  try {
    const currentLang = getCurrentLanguage();
    
    // 如果选择的语言与当前语言相同，不执行任何操作
    if (language === currentLang) {
      onSuccess?.();
      return;
    }
    
    if (isLocalEnvironment()) {
      // 本地环境：使用URL参数重定向
      const newUrl = buildLanguageUrl(language);
      safeRedirect(newUrl, () => {
        if (fallbackToClientSide && typeof window !== 'undefined' && window.i18n) {
          window.i18n.changeLanguage(language);
          localStorage.setItem('i18nextLng', language);
          onSuccess?.();
        }
      });
    } else {
      // 生产环境：重定向到语言子域名
      redirectToLanguage(language);
      onSuccess?.();
    }
  } catch (error) {
    const err = error as Error;
    logError(err, `Failed to switch language to: ${language}`);
    
    if (fallbackToClientSide && typeof window !== 'undefined' && window.i18n) {
      try {
        window.i18n.changeLanguage(language);
        localStorage.setItem('i18nextLng', language);
        onSuccess?.();
      } catch (fallbackError) {
        onError?.(fallbackError as Error);
      }
    } else {
      onError?.(err);
    }
  }
}