# 多语言支持前端集成指南

## 概述

本指南将帮助您更新前端代码以使用新的多语言数据库字段。数据库迁移完成后，您需要修改React组件来显示本地化的产品和分类信息。

## 数据库字段变更

### 新增字段

**Categories 表:**
- `name_i18n` (JSONB) - 分类名称的多语言版本
- `description_i18n` (JSONB) - 分类描述的多语言版本

**Products 表:**
- `name_i18n` (JSONB) - 产品名称的多语言版本
- `description_i18n` (JSONB) - 产品描述的多语言版本
- `features_i18n` (JSONB) - 产品特性的多语言版本
- `tags_i18n` (JSONB) - 产品标签的多语言版本

### 数据结构示例

```json
{
  "en": "AgriDrone Pro X1",
  
  "es": "AgriDrone Pro X1",
  "fr": "AgriDrone Pro X1",
  "de": "AgriDrone Pro X1",
  "ja": "アグリドローン プロ X1",
  "ko": "아그리드론 프로 X1",
  "pt": "AgriDrone Pro X1",
  "it": "AgriDrone Pro X1"
}
```

## 前端实现步骤

### 1. 创建语言上下文 (如果还没有)

```typescript
// contexts/LanguageContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'pt' | 'it';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  getLocalizedText: (i18nObject: Record<string, string>, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const getLocalizedText = (i18nObject: Record<string, string>, fallback = '') => {
    if (!i18nObject || typeof i18nObject !== 'object') {
      return fallback;
    }
    return i18nObject[currentLanguage] || i18nObject['en'] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, getLocalizedText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

### 2. 更新类型定义

```typescript
// types/database.ts
export interface Category {
  id: string;
  name: string; // 保留原字段作为后备
  description?: string; // 保留原字段作为后备
  name_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  parent_id?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string; // 保留原字段作为后备
  description?: string; // 保留原字段作为后备
  name_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  features_i18n: Record<string, string>;
  tags_i18n: Record<string, string>;
  specifications: Record<string, any>;
  price: number;
  currency: string;
  image_urls: string[];
  category_id: string;
  tags: string[]; // 保留原字段作为后备
  features: string[]; // 保留原字段作为后备
  created_at: string;
  updated_at: string;
}
```

### 3. 更新Supabase查询

```typescript
// services/supabase.ts
import { supabase } from './supabaseClient';
import { Product, Category } from '../types/database';

// 获取所有产品（包含多语言字段）
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, name_i18n)
    `);

  if (error) throw error;
  return data || [];
};

// 获取所有分类（包含多语言字段）
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) throw error;
  return data || [];
};

// 使用视图获取本地化数据（推荐）
export const getLocalizedProducts = async (language: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products_localized')
    .select('*')
    .eq('language', language);

  if (error) throw error;
  return data || [];
};
```

### 4. 更新产品组件

```typescript
// components/ProductCard.tsx
import React from 'react';
import { Product } from '../types/database';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { getLocalizedText } = useLanguage();

  const localizedName = getLocalizedText(product.name_i18n, product.name);
  const localizedDescription = getLocalizedText(product.description_i18n, product.description);
  
  // 解析多语言特性（JSON字符串格式）
  const getLocalizedFeatures = () => {
    try {
      const featuresObj = product.features_i18n;
      const localizedFeaturesStr = getLocalizedText(featuresObj, JSON.stringify(product.features || []));
      return JSON.parse(localizedFeaturesStr);
    } catch {
      return product.features || [];
    }
  };

  // 解析多语言标签
  const getLocalizedTags = () => {
    try {
      const tagsObj = product.tags_i18n;
      const localizedTagsStr = getLocalizedText(tagsObj, JSON.stringify(product.tags || []));
      return JSON.parse(localizedTagsStr);
    } catch {
      return product.tags || [];
    }
  };

  const features = getLocalizedFeatures();
  const tags = getLocalizedTags();

  return (
    <div className="product-card">
      <h3>{localizedName}</h3>
      <p>{localizedDescription}</p>
      
      <div className="features">
        <h4>Features:</h4>
        <ul>
          {features.map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      <div className="tags">
        {tags.map((tag: string, index: number) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      
      <div className="price">
        {product.currency} {product.price}
      </div>
    </div>
  );
};
```

### 5. 更新分类组件

```typescript
// components/CategoryList.tsx
import React from 'react';
import { Category } from '../types/database';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryListProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onCategorySelect }) => {
  const { getLocalizedText } = useLanguage();

  return (
    <div className="category-list">
      {categories.map((category) => {
        const localizedName = getLocalizedText(category.name_i18n, category.name);
        const localizedDescription = getLocalizedText(category.description_i18n, category.description);
        
        return (
          <div 
            key={category.id} 
            className="category-item"
            onClick={() => onCategorySelect(category.id)}
          >
            <h4>{localizedName}</h4>
            {localizedDescription && <p>{localizedDescription}</p>}
          </div>
        );
      })}
    </div>
  );
};
```

### 6. 语言切换组件

```typescript
// components/LanguageSwitcher.tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English' },

  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
];

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => setLanguage(e.target.value as any)}
      className="language-switcher"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
```

### 7. 更新主应用

```typescript
// App.tsx
import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ProductList } from './components/ProductList';
import { CategoryList } from './components/CategoryList';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <header>
          <h1>PartDro</h1>
          <LanguageSwitcher />
        </header>
        
        <main>
          <CategoryList />
          <ProductList />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
```

## 迁移执行顺序

1. **备份数据库**
2. **执行主迁移**: `20250612120000_multilingual_support.sql`
3. **执行产品翻译第一部分**: `20250612120001_product_translations.sql`
4. **执行产品翻译第二部分**: `20250612120002_product_translations_part2.sql`
5. **验证数据**: 检查所有产品和分类都有多语言数据
6. **更新前端代码**: 按照本指南更新React组件
7. **测试**: 确保语言切换功能正常工作

## 注意事项

1. **后备机制**: 始终保留原始字段作为后备，以防多语言数据缺失
2. **错误处理**: 在解析JSON字符串时添加try-catch
3. **性能优化**: 考虑使用数据库视图来简化前端查询
4. **SEO**: 为不同语言版本设置正确的meta标签和URL结构
5. **缓存**: 考虑缓存翻译数据以提高性能

## 测试清单

- [ ] 所有产品名称在不同语言下正确显示
- [ ] 产品描述翻译正确
- [ ] 产品特性列表本地化正常
- [ ] 产品标签翻译正确
- [ ] 分类名称和描述本地化正常
- [ ] 语言切换功能正常工作
- [ ] 后备机制在数据缺失时正常工作
- [ ] 页面刷新后语言设置保持不变

## 故障排除

### 常见问题

1. **翻译数据为空**: 检查数据库迁移是否正确执行
2. **JSON解析错误**: 确保features和tags字段存储的是有效JSON字符串
3. **语言切换不生效**: 检查LanguageContext是否正确包装了组件
4. **后备数据不显示**: 确保getLocalizedText函数的后备逻辑正确

### 调试技巧

```typescript
// 添加调试日志
const getLocalizedText = (i18nObject: Record<string, string>, fallback = '') => {
  console.log('i18nObject:', i18nObject);
  console.log('currentLanguage:', currentLanguage);
  console.log('result:', i18nObject[currentLanguage] || i18nObject['en'] || fallback);
  
  if (!i18nObject || typeof i18nObject !== 'object') {
    return fallback;
  }
  return i18nObject[currentLanguage] || i18nObject['en'] || fallback;
};
```

完成这些步骤后，您的应用将完全支持9种语言的产品和分类信息显示！