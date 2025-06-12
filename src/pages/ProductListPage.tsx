import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Spin, Empty, Typography, Space, Pagination, message } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import ProductCard from '../components/Product/ProductCard';
import ProductFilter from '../components/Product/ProductFilter';
import ProductSort from '../components/Product/ProductSort';
import Breadcrumb from '../components/Layout/Breadcrumb';
import { Product, FilterOptions } from '../types/product';
import { ProductService } from '../services/productService';

const { Title } = Typography;

const ProductListPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({ category });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  
  const pageSize = 12;

  useEffect(() => {
    loadProducts();
    loadFilterData();
    // Update filters when category changes
    setFilters(prevFilters => ({
      ...prevFilters,
      category: category || undefined
    }));
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let productData: Product[];
      
      if (category) {
        productData = await ProductService.getProductsByCategory(category);
      } else {
        productData = await ProductService.getAllProducts();
      }
      
      setProducts(productData);
    } catch (error) {
      console.error('Error loading products:', error);
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const loadFilterData = async () => {
    try {
      const tags = await ProductService.getAllTags();
      
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filters
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    
    if (filters.subcategory) {
      result = result.filter(product => product.subcategory === filters.subcategory);
    }

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(product =>
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }



    // Sort products
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;

        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [products, filters, sortBy, sortOrder, searchQuery]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedProducts.slice(start, end);
  }, [filteredAndSortedProducts, currentPage]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ category });
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const categoryTitle = category 
    ? t(`categories.${category}`)
    : 'All Products';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <Title level={2} className={`${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          {categoryTitle}
        </Title>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {filteredAndSortedProducts.length} products found
          </span>
          <ProductSort
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Filter Sidebar */}
        <Col xs={24} lg={6}>
          <ProductFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            availableTags={availableTags}

          />
        </Col>

        {/* Product Grid */}
        <Col xs={24} lg={18}>
          {paginatedProducts.length === 0 ? (
            <Empty
              description={t('common.noResults')}
              className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            />
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {paginatedProducts.map((product) => (
                  <Col xs={24} sm={12} lg={8} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {filteredAndSortedProducts.length > pageSize && (
                <div className="mt-8 text-center">
                  <Pagination
                    current={currentPage}
                    total={filteredAndSortedProducts.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} products`
                    }
                  />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductListPage;