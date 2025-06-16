import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { subdomainLanguageDetector, DEFAULT_LANGUAGE } from '../utils/languageUtils';

import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import th from './locales/th.json';
import pt from './locales/pt.json';
import it from './locales/it.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  ja: { translation: ja },
  ko: { translation: ko },
  th: { translation: th },
  pt: { translation: pt },
  it: { translation: it },
  fr: { translation: fr },
};

// 添加自定义子域名检测器
i18n.use({
  type: 'languageDetector',
  async: false,
  detect: subdomainLanguageDetector.lookup,
  init: () => {},
  cacheUserLanguage: subdomainLanguageDetector.cacheUserLanguage,
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: false,
    detection: {
      order: ['subdomainDetector'],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;