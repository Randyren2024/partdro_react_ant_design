import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Spin, App as AntApp } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import EditorPage from './pages/EditorPage';
import ProductEditPage from './pages/ProductEditPage';
import UnifiedProductEditPage from './pages/UnifiedProductEditPage';
import ProductManagePage from './pages/ProductManagePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import { 
  shouldRedirectToWww, 
  getWwwUrl 
} from './utils/languageUtils';
import './i18n';

const { Content } = Layout;



function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.dataLayer.push({
      event: 'pageview',
      page: location.pathname + location.search,
    });
  }, [location]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 导航到产品列表页面并传递搜索参数
    if (query.trim()) {
      navigate(`/drones?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // 处理www重定向逻辑
  useEffect(() => {
    // 检查是否需要重定向到www域名
    // 注意：语言子域名不应该被重定向到www
    if (shouldRedirectToWww()) {
      const wwwUrl = getWwwUrl(window.location.pathname + window.location.search);
      console.log('Redirecting to www:', wwwUrl);
      window.location.href = wwwUrl;
      return;
    }
  }, []);

  return (
    <AntApp>
        <Layout className="min-h-screen">
          <Header onSearch={handleSearch} searchValue={searchQuery} />
          <Content className="flex-1">
            <Suspense
              fallback={
                <div className="flex justify-center items-center min-h-96">
                  <Spin size="large" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/drones" element={<ProductListPage />} />
                <Route path="/robots" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/admin/products" element={<ProductManagePage />} />
                <Route path="/admin/products/new/edit" element={<UnifiedProductEditPage />} />
                <Route path="/admin/products/:id/edit" element={<UnifiedProductEditPage />} />
                <Route path="/admin/products/legacy/:id/edit" element={<ProductEditPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </Suspense>
          </Content>
          <Footer />
          <WhatsAppButton phoneNumber="8613362853598" />
        </Layout>
    </AntApp>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;