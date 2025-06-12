import React from 'react';
import { Typography, Layout, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const TermsPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <Content className={`${isDark ? 'bg-gray-800' : 'bg-white'} min-h-screen py-12`}>
      <div className="max-w-4xl mx-auto px-4">
        <Title level={1} className={`${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>
          Terms of Service
        </Title>

        <Space direction="vertical" size="large" className="w-full">
          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Acceptance of Terms
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              By accessing or using our services, you agree to be bound by these Terms of Service. If you
              do not agree to these terms, please do not use our services.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Use of Services
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Our services are intended for commercial and industrial use. You agree to use our services
              only for lawful purposes and in accordance with these Terms of Service.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Product Information
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We strive to provide accurate product information, but we do not warrant that product
              descriptions or other content is accurate, complete, reliable, current, or error-free.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Intellectual Property
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              All content on this website, including text, graphics, logos, and software, is the property
              of partdro or its content suppliers and is protected by international copyright laws.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Limitation of Liability
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We will not be liable for any damages of any kind arising from the use of our services,
              including but not limited to direct, indirect, incidental, punitive, and consequential damages.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Changes to Terms
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We reserve the right to modify these terms at any time. Your continued use of our services
              following the posting of changes will constitute your acceptance of such changes.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Contact
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              If you have any questions about these Terms of Service, please contact us at info@partdro.com
            </Paragraph>
          </section>
        </Space>
      </div>
    </Content>
  );
};

export default TermsPage;