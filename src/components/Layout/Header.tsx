import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Menu, Input, Select, Button, Space, Drawer, AutoComplete, Avatar, Modal, Dropdown } from 'antd';
import { SearchOutlined, GlobalOutlined, BulbOutlined, MenuOutlined, SunOutlined, MoonOutlined, UserOutlined, SettingOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Zap, Cpu } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import LoginForm from '../auth/LoginForm';
import { ProductService } from '../../services/productService';
import { Product } from '../../types/product';
import { debounce } from 'lodash';

const { Header: AntHeader } = Layout;
const { Option } = Select;

interface HeaderProps {
  onSearch: (value: string) => void;
  searchValue: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchValue }) => {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<{value: string, label: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        // 获取搜索建议
        const products = await ProductService.searchProducts(query, {}, 'name', 'asc');
        const suggestions = products.slice(0, 5).map(product => ({
          value: product.name,
          label: product.name
        }));
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('搜索建议获取失败:', error);
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    onSearch(value);
    debouncedSearch(value);
  };

  // 处理搜索选择
  const handleSearchSelect = (value: string) => {
    onSearch(value);
    setSearchSuggestions([]);
    // 导航到搜索结果页面
    if (value.trim()) {
      navigate(`/drones?search=${encodeURIComponent(value.trim())}`);
    }
  };

  // 处理回车键搜索
  const handleSearchEnter = (value: string) => {
    if (value.trim()) {
      onSearch(value);
      setSearchSuggestions([]);
      navigate(`/drones?search=${encodeURIComponent(value.trim())}`);
    }
  };

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

  // 用户菜单项
  const userMenuItems = [
    ...(isAdmin ? [
      {
        key: 'admin-products',
        label: '产品管理',
        icon: <SettingOutlined />,
        onClick: () => navigate('/admin/products'),
      },
      {
        key: 'divider1',
        type: 'divider' as const,
      },
    ] : []),
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: () => {
        signOut();
      },
    },
  ];

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
          <AutoComplete
            options={searchSuggestions}
            value={searchValue}
            onChange={handleSearchChange}
            onSelect={handleSearchSelect}
            placeholder={t('nav.search')}
            className="w-full"
            notFoundContent={isSearching ? t('searching') : null}
          >
            <Input
              onPressEnter={(e) => {
                const target = e.target as HTMLInputElement;
                handleSearchEnter(target.value);
              }}
              className={`max-w-md bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border-neutral-200 dark:border-neutral-600 rounded-lg h-10 font-medium ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
              size="large"
            />
          </AutoComplete>
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

          {/* User Menu */}
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" className="flex items-center">
                <Avatar size="small" icon={<UserOutlined />} className="mr-1" />
                <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
              </Button>
            </Dropdown>
          ) : (
            <Button
              type="text"
              icon={<LoginOutlined />}
              onClick={() => setLoginModalVisible(true)}
            >
              <span className="hidden sm:inline">管理员登录</span>
            </Button>
          )}

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
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          onPressEnter={(e) => {
            const target = e.target as HTMLInputElement;
            handleSearchEnter(target.value);
          }}
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

      {/* Login Modal */}
      <Modal
        title={null}
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <LoginForm
          onSuccess={() => setLoginModalVisible(false)}
          onCancel={() => setLoginModalVisible(false)}
        />
      </Modal>
    </AntHeader>
  );
};

export default Header;