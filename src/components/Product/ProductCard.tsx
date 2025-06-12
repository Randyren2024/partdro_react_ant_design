import React from 'react';
import { Card, Tag, Button, Typography, Image } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Product } from '../../types/product';

const { Title, Text } = Typography;
const { Meta } = Card;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      hoverable
      className={`product-card h-full transition-all duration-300 hover:scale-105 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      cover={
        <div className="relative overflow-hidden">
          <Image
            alt={product.name}
            src={product.images[0] || 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg'}
            className="w-full h-48 object-cover"
            preview={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={handleViewProduct}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 border-none"
              >
                View Details
              </Button>
            </div>
          </div>
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
          icon={<ShoppingCartOutlined />}
          onClick={handleViewProduct}
          className={isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}
        >
          {t('product.inquireNow')}
        </Button>,
      ]}
    >
      <Meta
        title={
          <Title level={5} className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </Title>
        }
        description={
          <div className="space-y-3">
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
              {product.description}
            </Text>
            
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <Tag
                  key={tag}
                  color="cyan"
                  className="text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30"
                >
                  {tag}
                </Tag>
              ))}
              {product.tags.length > 3 && (
                <Tag className="text-xs">+{product.tags.length - 3}</Tag>
              )}
            </div>

            <div className="flex justify-between items-center">

              <Tag color="blue" className="capitalize">
                {product.category}
              </Tag>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;