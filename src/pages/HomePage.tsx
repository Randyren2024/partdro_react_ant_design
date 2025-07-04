import React from 'react';
import { Typography, Row, Col, Card, Button, Space, Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Zap, Shield, Settings, Globe } from 'lucide-react';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-cyan-400" />,
      title: t('home.features.advancedTech.title'),
      description: t('home.features.advancedTech.description'),
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: t('home.features.industrialGrade.title'),
      description: t('home.features.industrialGrade.description'),
    },
    {
      icon: <Settings className="w-8 h-8 text-cyan-400" />,
      title: t('home.features.customizable.title'),
      description: t('home.features.customizable.description'),
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500" />,
      title: t('home.features.globalSupport.title'),
      description: t('home.features.globalSupport.description'),
    },
  ];

  const categories = [
    {
      title: t('categories.drones'),
      description: t('home.categories.dronesDescription'),
      image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg',
      path: '/drones',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      title: t('categories.robots'),
      description: t('home.categories.robotsDescription'),
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
      path: '/robots',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Carousel autoplay dots={false} effect="fade">
          <div>
            <img src="/banners/CompanyProfile_p1_img1.jpeg" alt="Banner 1" className="w-full h-[500px] md:h-[600px] object-cover" />
          </div>
          <div>
            <img src="/banners/m16_banner.png" alt="Banner 2" className="w-full h-[500px] md:h-[600px] object-cover" />
          </div>
        </Carousel>
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
          <Title level={1} className={`text-5xl md:text-7xl font-bold mb-6 text-white`}>
            {t('home.hero.title')}{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {t('home.hero.brand')}
            </span>
          </Title>
          <Paragraph className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200`}>
            {t('home.hero.subtitle')}
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/drones')}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 border-none h-12 px-8 text-lg font-semibold"
            >
              {t('home.hero.exploreDrones')} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/robots')}
              className={`h-12 px-8 text-lg font-semibold bg-white/20 text-white border-white/30 hover:bg-white/30`}
            >
              {t('home.hero.viewRobots')}
            </Button>
          </Space>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Title level={2} className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('home.features.title')}
            </Title>
            <Paragraph className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              {t('home.features.subtitle')}
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  className={`h-full text-center transition-transform duration-300 hover:scale-105 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <Title level={4} className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </Title>
                  <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Title level={2} className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('home.categories.title')}
            </Title>
            <Paragraph className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              {t('home.categories.subtitle')}
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {categories.map((category, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card
                  hoverable
                  className={`h-full overflow-hidden transition-transform duration-300 hover:scale-105 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                  cover={
                    <div className="relative h-64 overflow-hidden">
                      <img
                        alt={category.title}
                        src={category.image}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`}></div>
                      <div className="absolute inset-0 flex items-end">
                        <div className="p-6 text-white">
                          <Title level={3} className="text-white mb-2">
                            {category.title}
                          </Title>
                          <Paragraph className="text-gray-100 mb-4">
                            {category.description}
                          </Paragraph>
                          <Button
                            type="primary"
                            onClick={() => navigate(category.path)}
                            className="bg-white/20 border-white/30 hover:bg-white/30"
                          >
                            {t('home.categories.explore')} {category.title} <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  }
                />
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
};

export default HomePage;