import { supabase } from '../lib/supabase';
import { Product, FilterOptions, Category } from '../types/product';

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data || [];
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw error;
    }

    return data;
  }

  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }

    return data || [];
  }

  // 获取所有分类（包含多语言字段）
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  }

  // 使用本地化视图获取产品（如果可用）
  static async getLocalizedProducts(language: string): Promise<Product[]> {
    // 首先尝试使用本地化视图
    const { data: viewData, error: viewError } = await supabase
      .from('products_localized')
      .select('*')
      .eq('language', language);

    if (!viewError && viewData) {
      return viewData;
    }

    // 如果视图不可用，回退到常规查询
    return this.getAllProducts();
  }

  static async searchProducts(
    searchQuery: string,
    filters: FilterOptions = {},
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<Product[]> {
    let query = supabase.from('products').select('*');

    // Apply search query using full-text search
    if (searchQuery) {
      query = query.textSearch('name,description,tags', searchQuery);
    }

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Apply subcategory filter
    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }

        // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    return data || [];
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit: number = 3): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryId)
      .neq('id', productId)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }

    return data || [];
  }

  static async getAllTags(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('tags');

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }

    // Flatten and deduplicate tags
    const allTags = data?.flatMap(product => product.tags || []) || [];
    return Array.from(new Set(allTags)).sort();
  }


}