import React from 'react';
import { Layout, Menu, Input, Select, Button, Space, Drawer } from 'antd';
import { SearchOutlined, GlobalOutlined, BulbOutlined, MenuOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Zap, Cpu } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';

const { Header: AntHeader } = Layout;
const { Option } = Select;

interface HeaderProps {
  onSearch: (value: string) => void;
  searchValue: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchValue }) => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = React.useState(false);



  const menuItems = [
    {
      key: '/',
      label: t('nav.home'),
      onClick: () => navigate('/'),
    },
    {
      key: '/drones',
      label: t('nav.drones'),
      onClick: () => navigate('/drones'),
    },
    {
      key: '/robots',
      label: t('nav.robots'),
      onClick: () => navigate('/robots'),
    },
  ];

  const currentPath = location.pathname;

  return (
    <AntHeader className={`sticky top-0 z-50 shadow-lg ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <Zap className="w-8 h-8 text-cyan-400" />
            <Cpu className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
          </div>
          <span className={`text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hidden sm:block`}>
            partdro
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Menu
            mode="horizontal"
            selectedKeys={[currentPath]}
            items={menuItems}
            className={`border-none ${isDark ? 'bg-transparent' : 'bg-transparent'}`}
            style={{ minWidth: 0, flex: 'auto' }}
          />
        </div>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <Input
            placeholder={t('nav.search')}
            prefix={<SearchOutlined className="text-neutral-400" />}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className={`max-w-md bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border-neutral-200 dark:border-neutral-600 rounded-lg h-10 font-medium ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
            size="large"
          />
        </div>

        {/* Right Side Controls */}
        <Space size="middle">
          {/* Language Selector */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 h-10 w-10 flex items-center justify-center rounded-lg"
            size="large"
          />

          {/* Mobile Menu Button */}
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            type="text"
            className="lg:hidden"
          />
        </Space>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <Input
          placeholder={t('nav.search')}
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className={`rounded-full ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        className="lg:hidden"
      >
        <Menu
          mode="vertical"
          selectedKeys={[currentPath]}
          items={menuItems}
          className="border-none"
        />
      </Drawer>
    </AntHeader>
  );
};

export default Header;