import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const success = await signIn(values.email, values.password);
      if (success) {
        form.resetFields();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="w-full max-w-md mx-auto"
      style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="text-center mb-6">
        <Title level={3} className="mb-2">
          <LoginOutlined className="mr-2" />
          管理员登录
        </Title>
        <Text type="secondary">
          请输入您的管理员凭据以访问产品编辑功能
        </Text>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="邮箱地址"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="admin@partdro.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少需要6个字符' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item className="mb-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            icon={<LoginOutlined />}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>

        {onCancel && (
          <>
            <Divider>或</Divider>
            <Form.Item className="mb-0">
              <Button
                type="default"
                onClick={onCancel}
                block
                size="large"
              >
                取消
              </Button>
            </Form.Item>
          </>
        )}
      </Form>

      <div className="mt-6 text-center">
        <Text type="secondary" className="text-sm">
          <strong>测试账户:</strong><br />
          邮箱: admin@partdro.com<br />
          密码: admin123
        </Text>
      </div>
    </Card>
  );
};

export default LoginForm;