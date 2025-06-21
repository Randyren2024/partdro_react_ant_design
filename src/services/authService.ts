import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
}

export class AuthService {
  // 登录
  static async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { user: null, session: null, error };
    }

    return { user: data.user, session: data.session, error: null };
  }

  // 登出
  static async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }
    
    return { error };
  }

  // 获取当前用户
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    
    return user;
  }

  // 获取当前会话
  static async getCurrentSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    
    return session;
  }

  // 检查用户是否有管理员权限
  static async isAdmin(): Promise<boolean> {
    console.log('isAdmin method called');
    // 临时直接返回true进行测试
    console.log('isAdmin - returning true for testing');
    return true;
  }

  // 监听认证状态变化
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // 注册新用户（仅管理员可用）
  static async signUp(email: string, password: string, role: 'admin' | 'editor' | 'viewer' = 'viewer'): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }

    // 创建用户角色记录
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          email: data.user.email,
          role: role,
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }

    return { user: data.user, error: null };
  }

  // 重置密码
  static async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Reset password error:', error);
    }

    return { error };
  }
}