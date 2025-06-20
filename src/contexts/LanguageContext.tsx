import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { redirectToLanguage, logLanguageChange, SupportedLanguage, getCurrentLanguage, SUPPORTED_LANGUAGES } from '../utils/languageUtils';

type Language = SupportedLanguage;

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  getLocalizedText: (i18nObject: Record<string, string>, fallback?: string) => string;
  getLocalizedArray: (i18nObject: Record<string, string>, fallback?: string[]) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // 使用 getCurrentLanguage 函数获取当前语言（支持子域名检测）
    return getCurrentLanguage();
  });

  useEffect(() => {
    // 同步语言设置到i18n
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const setLanguage = (lang: Language) => {
    const previousLanguage = currentLanguage;
    
    // 记录语言切换日志
    logLanguageChange(previousLanguage, lang, 'subdomain');
    
    // 更新本地状态
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
    i18n.changeLanguage(lang);
    
    // 执行子域名重定向
    redirectToLanguage(lang);
  };

  const getLocalizedText = (i18nObject: Record<string, string>, fallback = '') => {
    if (!i18nObject || typeof i18nObject !== 'object') {
      return fallback;
    }
    
    // 首先尝试当前语言
    if (i18nObject[currentLanguage]) {
      return i18nObject[currentLanguage];
    }
    

    
    // 后备到英语
    if (i18nObject['en']) {
      return i18nObject['en'];
    }
    
    // 最后使用fallback
    return fallback;
  };

  const getLocalizedArray = (i18nObject: Record<string, string>, fallback: string[] = []) => {
    try {
      const localizedStr = getLocalizedText(i18nObject, JSON.stringify(fallback));
      return JSON.parse(localizedStr);
    } catch {
      return fallback;
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      getLocalizedText, 
      getLocalizedArray 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export type { Language };