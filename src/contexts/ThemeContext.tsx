import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const antdTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#00D4FF',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#6366f1',
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 6,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeXL: 20,
      lineHeight: 1.5,
      lineHeightLG: 1.75,
      colorText: isDark ? '#f5f5f5' : '#171717',
      colorTextSecondary: isDark ? '#a3a3a3' : '#525252',
      colorTextTertiary: isDark ? '#737373' : '#737373',
      colorBgBase: isDark ? '#0a0a0a' : '#ffffff',
      colorBgContainer: isDark ? '#171717' : '#ffffff',
      colorBgElevated: isDark ? '#262626' : '#ffffff',
      colorBorder: isDark ? '#404040' : '#e5e5e5',
      colorBorderSecondary: isDark ? '#262626' : '#f5f5f5',
    },
    components: {
      Layout: {
        bodyBg: isDark ? '#0a0a0a' : '#ffffff',
        headerBg: isDark ? 'rgba(23, 23, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        footerBg: isDark ? '#171717' : '#fafafa',
      },
      Card: {
        colorBgContainer: isDark ? '#171717' : '#ffffff',
        boxShadowTertiary: isDark 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      Button: {
        borderRadius: 8,
        fontWeight: 500,
        boxShadow: 'none',
        primaryShadow: 'none',
      },
      Input: {
        borderRadius: 8,
        colorBgContainer: isDark ? '#262626' : '#ffffff',
      },
      Select: {
        borderRadius: 8,
        colorBgContainer: isDark ? '#262626' : '#ffffff',
      },
      Table: {
        borderRadius: 8,
        colorBgContainer: isDark ? '#171717' : '#ffffff',
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};