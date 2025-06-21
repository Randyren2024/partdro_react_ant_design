import { supabase } from '../lib/supabase';
import { ContentBlock } from '../types/editor';

export class EditorService {
  /**
   * 获取页面的所有内容块
   */
  static async getContentBlocks(pageId: string): Promise<ContentBlock[]> {
    try {
      const { data, error } = await supabase
        .from('editable_content_blocks')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .order('position_order', { ascending: true });

      if (error) {
        console.error('获取内容块失败:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('获取内容块服务错误:', error);
      throw error;
    }
  }

  /**
   * 获取产品相关的所有内容块
   */
  static async getProductContentBlocks(productId: string): Promise<ContentBlock[]> {
    try {
      const { data, error } = await supabase
        .from('editable_content_blocks')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)
        .order('position_order', { ascending: true });

      if (error) {
        console.error('获取产品内容块失败:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('获取产品内容块服务错误:', error);
      throw error;
    }
  }

  /**
   * 删除产品的所有内容块
   */
  static async deleteProductContentBlocks(productId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('editable_content_blocks')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('product_id', productId);

      if (error) {
        console.error('删除产品内容块失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('删除产品内容块服务错误:', error);
      throw error;
    }
  }

  /**
   * 创建新的内容块
   */
  static async createContentBlock(block: Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>): Promise<ContentBlock> {
    try {
      const { data, error } = await supabase
        .from('editable_content_blocks')
        .insert([{
          ...block,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('创建内容块失败:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('创建内容块服务错误:', error);
      throw error;
    }
  }

  /**
   * 更新内容块
   */
  static async updateContentBlock(id: string, updates: Partial<ContentBlock>): Promise<ContentBlock> {
    try {
      const { data, error } = await supabase
        .from('editable_content_blocks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('更新内容块失败:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('更新内容块服务错误:', error);
      throw error;
    }
  }

  /**
   * 删除内容块（软删除）
   */
  static async deleteContentBlock(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('editable_content_blocks')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('删除内容块失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('删除内容块服务错误:', error);
      throw error;
    }
  }

  /**
   * 批量更新内容块的位置顺序
   */
  static async updateBlocksOrder(blocks: { id: string; position_order: number }[]): Promise<void> {
    try {
      const updates = blocks.map(block => ({
        id: block.id,
        position_order: block.position_order,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('editable_content_blocks')
        .upsert(updates);

      if (error) {
        console.error('更新内容块顺序失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('更新内容块顺序服务错误:', error);
      throw error;
    }
  }

  /**
   * 上传图片到Supabase存储
   */
  static async uploadImage(file: File, path?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from('editor-content')
        .upload(filePath, file);

      if (error) {
        console.error('图片上传失败:', error);
        throw error;
      }

      // 获取公共URL
      const { data: urlData } = supabase.storage
        .from('editor-content')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('图片上传服务错误:', error);
      throw error;
    }
  }

  /**
   * 删除存储中的文件
   */
  static async deleteFile(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('editor-content')
        .remove([path]);

      if (error) {
        console.error('文件删除失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('文件删除服务错误:', error);
      throw error;
    }
  }
}