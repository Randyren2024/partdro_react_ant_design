import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import './i18n';

const { Content } = Layout;

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ThemeProvider>
      <Router>
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
              </Routes>
            </Suspense>
          </Content>
          <Footer />
          <WhatsAppButton phoneNumber="8613362853598" />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;