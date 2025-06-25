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
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-6`}>
              Last updated: {new Date().toLocaleDateString()}
            </Paragraph>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              This Privacy Policy describes how PartDro ("we", "our", or "us") collects, uses, and shares
              your personal information when you use our website and services.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              1. Information We Collect
            </Title>
            <Title level={4} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-4`}>
              Personal Information
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We collect information that you provide directly to us, including:
              • Name, email address, and phone number
              • Company information and business details
              • Account credentials and profile information
              • Payment and billing information
              • Communications and support requests
            </Paragraph>
            
            <Title level={4} className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-4`}>
              Automatically Collected Information
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We automatically collect certain information when you use our services:
              • Device information (IP address, browser type, operating system)
              • Usage data (pages visited, time spent, features used)
              • Cookies and similar tracking technologies
              • Location information (if permitted)
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              2. How We Use Your Information
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We use your information to:
              • Provide, maintain, and improve our services
              • Process transactions and manage your account
              • Communicate with you about our products and services
              • Provide customer support and respond to inquiries
              • Send important notices and updates
              • Analyze usage patterns and improve user experience
              • Comply with legal obligations and protect our rights
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              3. Information Sharing and Disclosure
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We do not sell or rent your personal information to third parties. We may share your
              information in the following circumstances:
              • With service providers who assist us in operating our business
              • When required by law or to protect our rights
              • In connection with a business transfer or merger
              • With your explicit consent
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              4. Data Security and Protection
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We implement industry-standard security measures to protect your personal information:
              • Encryption of data in transit and at rest
              • Regular security assessments and updates
              • Access controls and authentication measures
              • Secure data storage and backup procedures
              • Employee training on data protection practices
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              5. Your Rights and Choices
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              You have the following rights regarding your personal information:
              • Access: Request a copy of your personal data
              • Correction: Update or correct inaccurate information
              • Deletion: Request deletion of your personal data
              • Portability: Request transfer of your data
              • Opt-out: Unsubscribe from marketing communications
              • Restriction: Limit how we process your data
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              6. Cookies and Tracking Technologies
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We use cookies and similar technologies to:
              • Remember your preferences and settings
              • Analyze website traffic and usage patterns
              • Provide personalized content and features
              • Improve our services and user experience
              
              You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              7. Data Retention
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We retain your personal information for as long as necessary to provide our services
              and fulfill the purposes outlined in this policy. We may retain certain information
              for longer periods as required by law or for legitimate business purposes.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              8. International Data Transfers
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data in accordance with
              applicable data protection laws.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              9. Changes to This Policy
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the new policy on our website and updating the
              "Last updated" date above.
            </Paragraph>
          </section>

          <section>
            <Title level={3} className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              10. Contact Us
            </Title>
            <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              If you have any questions about this Privacy Policy or our data practices,
              please contact us at:
              
              Email: privacy@partdro.com
              Address: [Your Company Address]
              Phone: [Your Phone Number]
            </Paragraph>
          </section>
        </Space>
      </div>
    </Content>
  );
};

export default PrivacyPage;