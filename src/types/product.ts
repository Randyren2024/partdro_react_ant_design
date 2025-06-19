export interface Product {
  id: string;
  name: string; // 保留原字段作为后备
  description: string; // 保留原字段作为后备
  name_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  features_i18n: Record<string, string>;
  tags_i18n: Record<string, string>;
  specifications_i18n: Record<string, Record<string, any>>;
  specifications: Record<string, any>;
  // Localized specifications fields
  specifications_en?: Record<string, any>;
  specifications_es?: Record<string, any>;
  specifications_fr?: Record<string, any>;
  specifications_de?: Record<string, any>;
  specifications_ja?: Record<string, any>;
  specifications_ko?: Record<string, any>;
  specifications_pt?: Record<string, any>;
  specifications_it?: Record<string, any>;
  price: number;
  currency: string;
  image_urls: string[];
  images: string[]; // 保留原字段作为后备
  video_url?: string;
  category: 'drones' | 'robots';
  category_id: string;
  subcategory?: string;
  tags: string[]; // 保留原字段作为后备
  features: string[]; // 保留原字段作为后备
  created_at: string;
  updated_at: string;
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