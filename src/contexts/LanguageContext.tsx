import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'pt' | 'it';

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
    // 从localStorage获取保存的语言设置，或使用i18n的当前语言
    const saved = localStorage.getItem('preferred-language');
    if (saved && ['en', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'it'].includes(saved)) {
      return saved as Language;
    }
    return (i18n.language as Language) || 'en';
  });

  useEffect(() => {
    // 同步语言设置到i18n
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
    i18n.changeLanguage(lang);
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