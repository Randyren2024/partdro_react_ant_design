import React from 'react';
import { Card, Tag, Button, Typography, Image } from 'antd';
import { EyeOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Product } from '../../types/product';
import { getProductUrl } from '../../utils/urlUtils';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { getLocalizedText, getLocalizedArray } = useLanguage();
  const navigate = useNavigate();

  // 获取本地化内容
  const localizedName = getLocalizedText(product.name_i18n || {}, product.name);
  const localizedDescription = getLocalizedText(product.description_i18n || {}, product.description);
  const localizedTags = getLocalizedArray(product.tags_i18n || {}, product.tags || []);
  const localizedFeatures = getLocalizedArray(product.features_i18n || {}, product.features || []);

  const handleViewProduct = () => {
    navigate(getProductUrl(product));
  };

  return (
    <Card
      hoverable
      className="product-card h-full transition-all duration-300 border-0"
      cover={
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            alt={localizedName}
            src={(product.image_urls && product.image_urls[0]) || (product.images && product.images[0]) || 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg'}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
          {localizedTags && localizedTags.length > 0 && (
            <div className="absolute top-3 left-3">
              <Tag 
                color="blue" 
                className="text-xs font-medium border-0 bg-white/90 text-neutral-700 backdrop-blur-sm"
              >
                {localizedTags[0]}
              </Tag>
            </div>
          )}
        </div>
      }
      actions={[
        <Button
          key="view"
          type="text"
          icon={<EyeOutlined />}
          onClick={handleViewProduct}
          className={isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}
        >
          View
        </Button>,
        <Button
          key="inquire"
          type="text"
          onClick={handleViewProduct}
          className={isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}
        >
          {t('product.inquireNow')}
        </Button>,
      ]}
    >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <Title level={4} className="!mb-0 !text-xl font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-tight">
                {localizedName}
              </Title>
            </div>
            
            {/* Inquiry Button */}
            <div className="flex items-center justify-center mb-4">
              <Button
                type="primary"
                size="small"
                onClick={() => window.open('https://api.whatsapp.com/send?phone=8613362853598', '_blank')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 border-none w-full"
              >
                {t('product.inquireNow')}
              </Button>
            </div>
            
            <Paragraph className="!mb-4 text-neutral-600 dark:text-neutral-400 line-clamp-2 text-sm leading-relaxed">
              {localizedDescription}
            </Paragraph>

            {localizedTags && localizedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {localizedTags.slice(0, 3).map((tag, index) => (
                  <Tag key={index} className="text-xs font-medium border-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md px-2 py-1">
                    {tag}
                  </Tag>
                ))}
                {localizedTags.length > 3 && (
                  <Tag className="text-xs font-medium border-0 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-md px-2 py-1">
                    +{localizedTags.length - 3}
                  </Tag>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={handleViewProduct}
                className="flex-1 btn-primary font-medium h-10"
              >
                {t('viewDetails')}
              </Button>
              <Button
                icon={<HeartOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to favorites logic
                }}
                className="btn-secondary h-10 w-10 flex items-center justify-center"
              />
            </div>
          </div>
    </Card>
  );
};

export default ProductCard;