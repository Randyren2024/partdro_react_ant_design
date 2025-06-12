export interface Product {
  id: string;
  name: string;
  description: string;
  specifications: Record<string, any>;

  images: string[];
  video_url?: string;
  category: 'drones' | 'robots';
  subcategory?: string;
  tags: string[];
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  description: string;
  image_url: string;
  created_at: string;
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