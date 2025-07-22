import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { MailOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface ContactFormProps {
  pageName: string;
  onSubmitSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ pageName, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const formStartTime = useRef<number>(Date.now());
  const [fieldInteractions, setFieldInteractions] = useState<Set<string>>(new Set());

  // Initialize dataLayer
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    
    // Track form view
    window.dataLayer.push({
      event: 'contact_form_view',
      form_location: pageName,
      page_url: window.location.href,
      timestamp: new Date().toISOString()
    });
    
    formStartTime.current = Date.now();
  }, [pageName]);

  // Track field interactions
  const trackFieldInteraction = (fieldName: string, action: 'focus' | 'blur' | 'change') => {
    const interactionKey = `${fieldName}_${action}`;
    
    if (!fieldInteractions.has(interactionKey)) {
      setFieldInteractions(prev => new Set([...prev, interactionKey]));
      
      window.dataLayer.push({
        event: 'form_field_interaction',
        field_name: fieldName,
        interaction_type: action,
        form_location: pageName,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Track form abandonment
  useEffect(() => {
    const handleBeforeUnload = () => {
      const formData = form.getFieldsValue();
      const hasData = Object.values(formData).some(value => value && value.toString().trim());
      
      if (hasData && !loading) {
        window.dataLayer.push({
          event: 'contact_form_abandonment',
          form_location: pageName,
          time_on_form: Date.now() - formStartTime.current,
          fields_completed: Object.keys(formData).filter(key => formData[key]).length,
          timestamp: new Date().toISOString()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form, loading, pageName]);

  // Handle form validation errors
  const handleFormFinishFailed = (errorInfo: any) => {
    window.dataLayer.push({
      event: 'contact_form_validation_error',
      form_location: pageName,
      validation_errors: errorInfo.errorFields.map((field: any) => ({
        field_name: field.name[0],
        error_messages: field.errors
      })),
      timestamp: new Date().toISOString(),
      event_category: 'form_validation',
      event_label: pageName
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const submissionStartTime = Date.now();
    
    // Track form submission attempt
    window.dataLayer.push({
      event: 'contact_form_submission_attempt',
      form_location: pageName,
      user_name: values.name || '',
      user_email: values.email || '',
      message_length: values.message ? values.message.length : 0,
      time_to_submit: submissionStartTime - formStartTime.current,
      timestamp: new Date().toISOString()
    });
    
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          page_name: pageName,
          name: values.name,
          email: values.email,
          message: values.message
        }]);

      if (error) throw error;

      // Track successful submission
      const submissionTime = Date.now() - submissionStartTime;
      window.dataLayer.push({
        event: 'lead_form_submission',
        form_location: pageName,
        user_name: values.name || '',
        user_email: values.email || '',
        message_length: values.message ? values.message.length : 0,
        submission_time: submissionTime,
        total_form_time: Date.now() - formStartTime.current,
        fields_interacted: fieldInteractions.size,
        timestamp: new Date().toISOString(),
        // GA4 Enhanced Ecommerce parameters
        currency: 'USD',
        value: 1, // Assign value to form submission for conversion tracking
        event_category: 'engagement',
        event_label: pageName
      });

      message.success(t('contact.success'));
      form.resetFields();
      if (onSubmitSuccess) onSubmitSuccess();
      
      // Reset form tracking
      formStartTime.current = Date.now();
      setFieldInteractions(new Set());
      
    } catch (error) {
      console.error('Error submitting contact:', error);
      
      // Track form submission error
      window.dataLayer.push({
        event: 'contact_form_submission_error',
        form_location: pageName,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        user_name: values.name || '',
        user_email: values.email || '',
        submission_time: Date.now() - submissionStartTime,
        total_form_time: Date.now() - formStartTime.current,
        timestamp: new Date().toISOString(),
        event_category: 'error',
        event_label: pageName
      });
      
      message.error(t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={handleFormFinishFailed}
        size="large"
        data-gtm-form="contact-form"
        data-gtm-location={pageName}
        id="contact-form"
        className="gtm-contact-form"
      >
        <Form.Item
          name="name"
          label={t('contact.name')}
          rules={[
            { required: true, message: t('contact.nameRequired') },
            { min: 2, message: t('contact.nameMin') }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('contact.namePlaceholder')}
            data-gtm-field="name"
            onFocus={() => trackFieldInteraction('name', 'focus')}
            onBlur={() => trackFieldInteraction('name', 'blur')}
            onChange={() => trackFieldInteraction('name', 'change')}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('contact.email')}
          rules={[
            { required: true, message: t('contact.emailRequired') },
            { type: 'email', message: t('contact.emailInvalid') }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('contact.emailPlaceholder')}
            data-gtm-field="email"
            onFocus={() => trackFieldInteraction('email', 'focus')}
            onBlur={() => trackFieldInteraction('email', 'blur')}
            onChange={() => trackFieldInteraction('email', 'change')}
          />
        </Form.Item>

        <Form.Item
          name="message"
          label={t('contact.message')}
          rules={[
            { required: true, message: t('contact.messageRequired') },
            { min: 10, message: t('contact.messageMin') }
          ]}
        >
          <TextArea
            prefix={<MessageOutlined />}
            placeholder={t('contact.messagePlaceholder')}
            rows={4}
            data-gtm-field="message"
            onFocus={() => trackFieldInteraction('message', 'focus')}
            onBlur={() => trackFieldInteraction('message', 'blur')}
            onChange={() => trackFieldInteraction('message', 'change')}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            data-gtm-button="contact-submit"
          >
            {t('contact.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactForm;