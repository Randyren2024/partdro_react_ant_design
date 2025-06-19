import React from 'react';
import { Card, Typography, Image } from 'antd';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Category } from '../../types/product';

const { Title, Text } = Typography;

interface CategoryListProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  selectedCategoryId?: string;
  className?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  onCategorySelect, 
  selectedCategoryId,
  className 
}) => {
  const { getLocalizedText } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div className={`category-list ${className || ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => {
          const localizedName = getLocalizedText(category.name_i18n || {}, category.name);
          const localizedDescription = getLocalizedText(category.description_i18n || {}, category.description);
          const isSelected = selectedCategoryId === category.id;
          
          return (
            <Card
              key={category.id}
              hoverable
              className={`category-item transition-all duration-300 cursor-pointer ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } ${
                isSelected 
                  ? 'ring-2 ring-cyan-500 border-cyan-500' 
                  : 'hover:border-cyan-400'
              }`}
              onClick={() => onCategorySelect(category.id)}
              cover={
                category.image_url ? (
                  <div className="relative overflow-hidden h-32">
                    <Image
                      alt={localizedName}
                      src={category.image_url}
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className={`h-32 flex items-center justify-center ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="text-4xl opacity-50">📦</div>
                  </div>
                )
              }
            >
              <div className="p-2">
                <Title 
                  level={5} 
                  className={`mb-2 text-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  } ${
                    isSelected ? 'text-cyan-500' : ''
                  }`}
                >
                  {localizedName}
                </Title>
                
                {localizedDescription && (
                  <Text 
                    className={`text-sm text-center block ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    } line-clamp-2`}
                  >
                    {localizedDescription}
                  </Text>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;