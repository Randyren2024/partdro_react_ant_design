import React, { useState } from 'react';
import { Modal, Spin, Result, Button } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = true, 
  fallback 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 显示加载状态
  console.log('ProtectedRoute - loading:', loading, 'user:', user, 'isAdmin:', isAdmin, 'requireAdmin:', requireAdmin);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 用户未登录
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        <Result
          icon={<UserOutlined />}
          title="需要登录"
          subTitle="您需要登录才能访问此页面"
          extra={
            <Button 
              type="primary" 
              size="large"
              onClick={() => setShowLoginModal(true)}
            >
              立即登录
            </Button>
          }
        />
        
        <Modal
          title={null}
          open={showLoginModal}
          onCancel={() => setShowLoginModal(false)}
          footer={null}
          width={400}
          centered
        >
          <LoginForm
            onSuccess={() => setShowLoginModal(false)}
            onCancel={() => setShowLoginModal(false)}
          />
        </Modal>
      </>
    );
  }

  // 需要管理员权限但用户不是管理员
  if (requireAdmin && !isAdmin) {
    return (
      <Result
        icon={<LockOutlined />}
        title="权限不足"
        subTitle="您没有访问此页面的权限。只有管理员和编辑者可以访问产品编辑功能。"
        extra={
          <div className="space-y-2">
            <div className="text-gray-600">
              当前登录用户: {user.email}
            </div>
            <Button type="primary" onClick={() => window.history.back()}>
              返回上一页
            </Button>
          </div>
        }
      />
    );
  }

  // 权限验证通过，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;