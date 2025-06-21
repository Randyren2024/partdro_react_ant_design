import { supabase } from '../lib/supabase';
import { Product, FilterOptions, Category } from '../types/product';
import { isUUID } from '../utils/urlUtils';

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

  static async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product by slug:', error);
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw error;
    }

    return data;
  }

  static async getProductByIdOrSlug(identifier: string): Promise<Product | null> {
    // First try to get by slug
    let product = await this.getProductBySlug(identifier);
    
    // If not found and identifier looks like UUID, try by ID
    if (!product && isUUID(identifier)) {
      product = await this.getProductById(identifier);
    }
    
    return product;
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
    if (!searchQuery.trim()) {
      // 如果没有搜索查询，返回所有产品
      return this.getAllProducts();
    }

    // 尝试多种搜索策略以实现模糊搜索
    const searchTerms = searchQuery.toLowerCase().trim();
    
    // 策略1: 精确全文搜索
    let exactQuery = supabase.from('products').select('*');
    exactQuery = exactQuery.textSearch('name,description,tags', searchQuery);
    
    // 策略2: 部分匹配搜索
    let partialQuery = supabase.from('products').select('*');
    partialQuery = partialQuery.or(
      `name.ilike.%${searchTerms}%,description.ilike.%${searchTerms}%,tags.cs.{"${searchTerms}"}`
    );
    
    // 策略3: 单词分割搜索
    const words = searchTerms.split(/\s+/).filter(word => word.length > 1);
    let wordQuery = supabase.from('products').select('*');
    if (words.length > 0) {
      const wordConditions = words.map(word => 
        `name.ilike.%${word}%,description.ilike.%${word}%,tags.cs.{"${word}"}`
      ).join(',');
      wordQuery = wordQuery.or(wordConditions);
    }

    // 执行所有查询
    const [exactResult, partialResult, wordResult] = await Promise.all([
      exactQuery,
      partialQuery,
      words.length > 0 ? wordQuery : Promise.resolve({ data: [], error: null })
    ]);

    // 合并结果并去重
    const allResults = new Map<number, Product>();
    
    // 添加精确匹配结果（最高优先级）
    if (exactResult.data) {
      exactResult.data.forEach(product => {
        allResults.set(product.id, { ...product, searchScore: 3 });
      });
    }
    
    // 添加部分匹配结果
    if (partialResult.data) {
      partialResult.data.forEach(product => {
        if (!allResults.has(product.id)) {
          allResults.set(product.id, { ...product, searchScore: 2 });
        }
      });
    }
    
    // 添加单词匹配结果
    if (wordResult.data) {
      wordResult.data.forEach(product => {
        if (!allResults.has(product.id)) {
          allResults.set(product.id, { ...product, searchScore: 1 });
        }
      });
    }

    let products = Array.from(allResults.values());

    // Apply filters
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters.subcategory) {
      products = products.filter(p => p.subcategory === filters.subcategory);
    }

    if (filters.tags && filters.tags.length > 0) {
      products = products.filter(p => 
        p.tags && filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // 按搜索相关性和指定字段排序
    products.sort((a, b) => {
      // 首先按搜索分数排序
      const scoreA = (a as any).searchScore || 0;
      const scoreB = (b as any).searchScore || 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      // 然后按指定字段排序
      const valueA = a[sortBy as keyof Product];
      const valueB = b[sortBy as keyof Product];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      return 0;
    });

    // 清理搜索分数属性
    products.forEach(product => {
      delete (product as any).searchScore;
    });

    if (exactResult.error || partialResult.error || wordResult.error) {
       console.error('Error searching products:', {
         exact: exactResult.error,
         partial: partialResult.error,
         word: wordResult.error
       });
     }

     return products;
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

  // 创建新产品
  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return data;
  }

  // 更新产品
  static async updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return data;
  }

  // 删除产品
  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // 上传产品图片
  static async uploadProductImage(file: File, productId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // 删除产品图片
  static async deleteProductImage(imageUrl: string): Promise<void> {
    // 从URL中提取文件路径
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // 获取 productId/filename.ext

    const { error } = await supabase.storage
      .from('product-images')
      .remove([`products/${filePath}`]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

}