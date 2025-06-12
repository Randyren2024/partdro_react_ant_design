import React from 'react';
import { Card, Select, Slider, Button, Space, Divider, Typography, Checkbox } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { FilterOptions } from '../../types/product';

const { Title } = Typography;
const { Option } = Select;

interface ProductFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  availableTags: string[];

}

const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  availableTags,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const categories = [
    { value: 'drones', label: t('categories.drones') },
    { value: 'robots', label: t('categories.robots') },
  ];

  const droneSubcategories = [
    { value: 'agricultural', label: t('categories.agricultural') },
    { value: 'industrial', label: t('categories.industrial') },
    { value: 'other', label: t('categories.other') },
  ];

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value,
      subcategory: undefined, // Reset subcategory when category changes
    });
  };

  const handleSubcategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      subcategory: value,
    });
  };

  const handleTagsChange = (checkedTags: string[]) => {
    onFiltersChange({
      ...filters,
      tags: checkedTags,
    });
  };



  return (
    <Card
      title={
        <div className="flex items-center space-x-2">
          <FilterOutlined className="text-cyan-400" />
          <Title level={5} className="mb-0">
            {t('common.filter')}
          </Title>
        </div>
      }
      extra={
        <Button
          type="text"
          icon={<ClearOutlined />}
          onClick={onClearFilters}
          className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
        >
          {t('common.clear')}
        </Button>
      }
      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <Space direction="vertical" className="w-full" size="large">
        {/* Category Filter */}
        <div>
          <Title level={5} className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('product.category')}
          </Title>
          <Select
            placeholder="Select category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full"
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Subcategory Filter (only for drones) */}
        {filters.category === 'drones' && (
          <div>
            <Title level={5} className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Subcategory
            </Title>
            <Select
              placeholder="Select subcategory"
              value={filters.subcategory}
              onChange={handleSubcategoryChange}
              className="w-full"
              allowClear
            >
              {droneSubcategories.map((subcat) => (
                <Option key={subcat.value} value={subcat.value}>
                  {subcat.label}
                </Option>
              ))}
            </Select>
          </div>
        )}



        <Divider className={isDark ? 'border-gray-600' : 'border-gray-300'} />

        {/* Tags Filter */}
        <div>
          <Title level={5} className={`mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('product.tags')}
          </Title>
          <Checkbox.Group
            value={filters.tags || []}
            onChange={handleTagsChange}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {availableTags.slice(0, 10).map((tag) => (
                <Checkbox key={tag} value={tag} className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {tag}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
      </Space>
    </Card>
  );
};

export default ProductFilter;