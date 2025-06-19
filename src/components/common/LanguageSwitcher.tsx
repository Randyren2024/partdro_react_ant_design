import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];

interface LanguageSwitcherProps {
  className?: string;
  size?: 'small' | 'middle' | 'large';
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className,
  size = 'middle',
  showIcon = true 
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
  };

  return (
    <Select
      value={currentLanguage}
      onChange={handleLanguageChange}
      className={className}
      size={size}
      style={{ minWidth: 120 }}
      suffixIcon={showIcon ? <GlobalOutlined /> : undefined}
      placeholder={t('selectLanguage', 'Select Language')}
    >
      {languages.map((lang) => (
        <Option key={lang.code} value={lang.code}>
          <span className="flex items-center gap-2">
            <span>{lang.nativeName}</span>
            <span className="text-gray-500 text-xs">({lang.name})</span>
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;