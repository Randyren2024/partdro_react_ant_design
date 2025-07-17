import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

import { MailOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          page_name: 'Contact Page',
          name: values.name,
          email: values.email,
          message: values.message
        }]);

      if (error) throw error;
      message.success(t('contact.success'));
      form.resetFields();
    } catch (error) {
      console.error('Error submitting contact:', error);
      message.error(t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-100 dark:bg-gray-900">
      <Card 
        className={`w-full max-w-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} 
        bordered={false}
        style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <Title level={2} className={`text-center mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('contact.title')}
        </Title>
        <Text className={`block text-center mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('contact.description') || 'We would love to hear from you. Please fill out the form below.'}
        </Text>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: t('contact.nameRequired') }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('contact.namePlaceholder')} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('contact.emailRequired') },
              { type: 'email', message: t('contact.emailInvalid') }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder={t('contact.emailPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="message"
            rules={[{ required: true, message: t('contact.messageRequired') }]}
          >
            <TextArea rows={4} prefix={<MessageOutlined />} placeholder={t('contact.messagePlaceholder')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('contact.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContactPage;