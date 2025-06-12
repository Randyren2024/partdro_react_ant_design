import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Zap, Cpu, Mail, Phone, MapPin } from 'lucide-react';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <AntFooter className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} mt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={12} lg={8}>
            <Space direction="vertical" size="middle" className="w-full">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Zap className="w-8 h-8 text-cyan-400" />
                  <Cpu className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
                </div>
                <Title level={4} className="mb-0 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  partdro
                </Title>
              </div>
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('footer.description')}
              </Text>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={8}>
            <Title level={5} className={`${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Quick Links
            </Title>
            <Space direction="vertical" size="small">
              <Link href="/drones" className={`${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}>
                {t('categories.drones')}
              </Link>
              <Link href="/robots" className={`${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}>
                {t('categories.robots')}
              </Link>
              <Link href="/about" className={`${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}>
                {t('footer.about')}
              </Link>
              <Link href="/contact" className={`${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}>
                {t('footer.contact')}
              </Link>
            </Space>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} lg={8}>
            <Title level={5} className={`${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              {t('footer.contact')}
            </Title>
            <Space direction="vertical" size="small">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  info@partdro.com
                </Text>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  0086-13362853598
                </Text>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('footer.address')}
                </Text>
              </div>
            </Space>
          </Col>
        </Row>

        <Divider className={`${isDark ? 'border-gray-700' : 'border-gray-300'} my-8`} />

        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              © 2024 partdro. All rights reserved.
            </Text>
          </Col>
          <Col xs={24} sm={12} className="text-right mt-4 sm:mt-0">
            <Space size="large">
              <Link href="/privacy" className={`${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-cyan-600'}`}>
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className={`${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-cyan-600'}`}>
                {t('footer.terms')}
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;