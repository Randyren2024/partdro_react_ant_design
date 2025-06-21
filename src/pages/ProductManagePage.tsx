import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Card,
  Typography,
  Space,
  Input,
  Select,
  Tag,
  Image,
  Popconfirm,
  message,
  Modal,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Product } from '../types/product';
import { ProductService } from '../services/productService';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ProductManagePageProps {}

const ProductManagePage: React.FC<ProductManagePageProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getAllProducts(),
        ProductService.getCategories(),
      ]);
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 过滤产品
  useEffect(() => {
    let filtered = products;

    // 按搜索文本过滤
    if (searchText) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // 按分类过滤
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchText, selectedCategory]);

  // 删除产品
  const handleDelete = async (id: string) => {
    try {
      await ProductService.deleteProduct(id);
      message.success('产品删除成功');
      loadData(); // 重新加载数据
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('删除失败');
    }
  };

  // 表格列定义
  const columns: ColumnsType<Product> = [
    {
      title: '主图',
      dataIndex: 'images',
      key: 'image',
      width: 80,
      render: (images: any[]) => {
        const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
        return primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            width={60}
            height={60}
            className="object-cover rounded"
            preview={{
              visible: previewVisible && previewImage === primaryImage.url,
              onVisibleChange: (visible) => {
                setPreviewVisible(visible);
                if (visible) setPreviewImage(primaryImage.url);
              },
            }}
          />
        ) : (
          <div className="w-15 h-15 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">无图片</span>
          </div>
        );
      },
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string, record: Product) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm truncate max-w-xs">
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags?.slice(0, 3).map(tag => (
            <Tag key={tag} size="small">{tag}</Tag>
          ))}
          {tags?.length > 3 && (
            <Tooltip title={tags.slice(3).join(', ')}>
              <Tag size="small">+{tags.length - 3}</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 120,
      sorter: (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record: Product) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/product/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/products/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个产品吗？"
              description="此操作不可撤销"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto p-6">
        {/* 页面头部 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={2}>产品管理</Title>
              {user && (
                <div className="text-gray-600">
                  当前用户: {user.email} | 共 {filteredProducts.length} 个产品
                </div>
              )}
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/products/new/edit')}
                size="large"
              >
                创建新产品
              </Button>
            </Space>
          </div>

          {/* 搜索和过滤 */}
          <Card className="mb-4">
            <Space className="w-full" direction="vertical">
              <div className="flex gap-4 flex-wrap">
                <Search
                  placeholder="搜索产品名称、描述或标签..."
                  allowClear
                  style={{ width: 300 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                />
                <Select
                  placeholder="选择分类"
                  allowClear
                  style={{ width: 200 }}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Space>
          </Card>
        </div>

        {/* 产品表格 */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredProducts.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
            scroll={{ x: 1200 }}
            size="middle"
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ProductManagePage;