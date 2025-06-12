import React from 'react';
import { Typography, Layout, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <Content className={`${isDark ? 'bg-gray-800' : 'bg-white'} min-h-screen py-12`}>
      <div className="max-w-4xl mx-auto px-4">
        <Title level={1} className={`${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>
          Privacy Policy
        </Title>

        <Space direction="vertical" size="large" className="w-full">
          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Information Collection
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We collect information that you provide directly to us, including when you create an account,
              make a purchase, contact us for support, or communicate with us. This may include your name,
              email address, phone number, and company information.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Use of Information
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We use the information we collect to provide, maintain, and improve our services, to process
              your transactions, and to communicate with you about our products and services.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Information Sharing
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We do not sell or rent your personal information to third parties. We may share your
              information with service providers who assist us in operating our business, processing
              transactions, and providing services to you.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Data Security
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Contact Us
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              If you have any questions about this Privacy Policy, please contact us at info@partdro.com
            </Paragraph>
          </section>
        </Space>
      </div>
    </Content>
  );
};

export default PrivacyPage;