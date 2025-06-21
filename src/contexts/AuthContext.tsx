import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '../services/authService';
import { message } from 'antd';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    console.log('checkAdminStatus called, user:', user);
    if (user) {
      const adminStatus = await AuthService.isAdmin();
      console.log('Admin status from service:', adminStatus);
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { user: authUser, session: authSession, error } = await AuthService.signIn(email, password);
      
      if (error) {
        message.error('登录失败: ' + error.message);
        return false;
      }
      
      if (authUser && authSession) {
        setUser(authUser);
        setSession(authSession);
        message.success('登录成功');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      message.error('登录过程中发生错误');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await AuthService.signOut();
      
      if (error) {
        message.error('登出失败: ' + error.message);
      } else {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        message.success('已成功登出');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      message.error('登出过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      try {
        const currentSession = await AuthService.getCurrentSession();
        const currentUser = await AuthService.getCurrentUser();
        
        setSession(currentSession);
        setUser(currentUser);
        
        if (currentUser) {
          const adminStatus = await AuthService.isAdmin();
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 监听认证状态变化
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const adminStatus = await AuthService.isAdmin();
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 当用户状态改变时检查管理员状态
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
    checkAdminStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};