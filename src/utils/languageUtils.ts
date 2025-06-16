// 支持的语言列表
export const SUPPORTED_LANGUAGES = ['en', 'es', 'de', 'ja', 'ko', 'th', 'pt', 'it', 'fr'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

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
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168.')) {
    return null;
  }

  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (SUPPORTED_LANGUAGES.includes(subdomain as SupportedLanguage)) {
      return subdomain as SupportedLanguage;
    }
  }
  return null;
}

/**
 * 获取当前语言
 * @returns 当前语言代码
 */
export function getCurrentLanguage(): SupportedLanguage {
  const { hostname, search } = window.location;
  
  // 本地开发环境：从URL参数获取语言
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168.')) {
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
}

/**
 * 构建语言URL
 * @param language - 目标语言
 * @param path - 路径 (可选)
 * @returns 完整的URL
 */
export function buildLanguageUrl(language: SupportedLanguage, path: string = ''): string {
  const { hostname, protocol, port, pathname, search } = window.location;
  
  // 本地开发环境：使用URL参数
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168.')) {
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
}

/**
 * 重定向到指定语言的子域名
 * @param language - 目标语言
 * @param path - 路径 (可选，默认为当前路径)
 */
export function redirectToLanguage(language: SupportedLanguage, path?: string): void {
  const targetPath = path || window.location.pathname + window.location.search;
  const url = buildLanguageUrl(language, targetPath);
  window.location.href = url;
}

/**
 * 检查是否需要重定向到www域名
 * @returns 是否需要重定向
 */
export function shouldRedirectToWww(): boolean {
  const { hostname } = window.location;
  
  // 本地开发环境不重定向
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168.')) {
    return false;
  }

  // 如果已经在www域名上，不需要重定向
  if (hostname.startsWith('www.')) {
    return false;
  }

  // 如果是语言子域名，需要重定向到www
  const currentLang = getLanguageFromSubdomain(hostname);
  if (currentLang && SUPPORTED_LANGUAGES.includes(currentLang)) {
    return true;
  }

  // 如果是主域名（没有子域名），需要重定向到www
  const parts = hostname.split('.');
  if (parts.length === 2) {
    return true;
  }

  return false;
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
  const { protocol, hostname } = window.location;
  
  // 本地开发环境处理
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168.')) {
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
}

/**
 * 自定义语言检测器，用于i18next
 */
export const subdomainLanguageDetector = {
  name: 'subdomainDetector',
  lookup(): string {
    return getCurrentLanguage();
  },
  cacheUserLanguage(language: string): void {
    const { hostname } = window.location;
    
    // 本地开发环境：缓存到localStorage
    if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168.')) {
      localStorage.setItem('i18nextLng', language);
    }
    // 生产环境：子域名方案不需要缓存到localStorage
  }
};