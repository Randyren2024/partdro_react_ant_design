export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  features: string[];
  specifications: Record<string, any>;
  images: ProductImage[];
  videos?: ProductVideo[];
  created_at: string;
  updated_at: string;
  
  // Internationalization fields
  name_i18n?: Record<string, string>;
  description_i18n?: Record<string, string>;
  features_i18n?: Record<string, string[]>;
  tags_i18n?: Record<string, string[]>;
  specifications_i18n?: Record<string, Record<string, any>>;
}

export interface Category {
  id: string;
  name: string; // 保留原字段作为后备
  description: string; // 保留原字段作为后备
  name_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  parent_id: string | null;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  tags?: string[];

  searchQuery?: string;
}

export interface SortOption {
  key: string;
  label: string;
  value: 'asc' | 'desc';
}