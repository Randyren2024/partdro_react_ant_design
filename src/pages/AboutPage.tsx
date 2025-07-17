import React from 'react';
import { Typography, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import ContactForm from '../components/common/ContactForm';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Title level={1} className={`${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
        {t('about.title') || 'About Us'}
      </Title>
      <Space direction="vertical" size="large" className="w-full">
        <Card className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
            {t('about.description') || 'We are a leading provider of innovative drone and robot solutions. Our mission is to push the boundaries of technology to create products that inspire and solve real-world problems.'}
          </Paragraph>
        </Card>
        <Card 
          title={t('contact.title') || 'Contact Us'}
          className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        >
          <ContactForm pageName="About Page" />
        </Card>
      </Space>
    </div>
  );
};

export default AboutPage;