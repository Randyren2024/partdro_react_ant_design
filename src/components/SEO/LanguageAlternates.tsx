import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getWwwUrl } from '../../utils/languageUtils';

interface LanguageAlternatesProps {
  path?: string;
}

const LanguageAlternates: React.FC<LanguageAlternatesProps> = ({ path = '' }) => {
  const { hostname } = window.location;
  
  // 在本地开发环境中不添加 canonical 标签
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168.')) {
    return null;
  }

  const canonicalUrl = getWwwUrl(path);

  return (
    <Helmet>
      {/* 添加当前页面的 canonical 标签指向www域名 */}
      <link
        rel="canonical"
        href={canonicalUrl}
      />
    </Helmet>
  );
};

export default LanguageAlternates;