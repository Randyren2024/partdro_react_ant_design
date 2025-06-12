import { supabase } from '../lib/supabase';
import { Product, FilterOptions } from '../types/product';

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

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }

    return data || [];
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

  static async getRelatedProducts(productId: string, category: string, limit: number = 3): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
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