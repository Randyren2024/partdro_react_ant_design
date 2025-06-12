import React from 'react';
import { Select, Space, Typography } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { SortOption } from '../../types/product';

const { Text } = Typography;
const { Option } = Select;

interface ProductSortProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const ProductSort: React.FC<ProductSortProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const { t } = useTranslation();

  const sortOptions: SortOption[] = [
    { key: 'name', label: 'Name A-Z', value: 'asc' },
    { key: 'name', label: 'Name Z-A', value: 'desc' },
    { key: 'price', label: 'Price Low-High', value: 'asc' },
    { key: 'price', label: 'Price High-Low', value: 'desc' },
    { key: 'created_at', label: 'Newest First', value: 'desc' },
    { key: 'created_at', label: 'Oldest First', value: 'asc' },
  ];

  const handleSortChange = (value: string) => {
    const [key, order] = value.split('-');
    onSortChange(key, order as 'asc' | 'desc');
  };

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <Space>
      <SortAscendingOutlined className="text-gray-500" />
      <Text strong>{t('common.sort')}:</Text>
      <Select
        value={currentValue}
        onChange={handleSortChange}
        className="w-48"
      >
        {sortOptions.map((option) => (
          <Option key={`${option.key}-${option.value}`} value={`${option.key}-${option.value}`}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default ProductSort;