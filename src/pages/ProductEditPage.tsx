import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Upload,
  Image,
  Select,
  Tag,
  Divider,
  Row,
  Col,
  message,
  Spin,
  Modal,
  Popconfirm,
} from 'antd';
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Product, ProductImage } from '../types/product';
import { ProductService } from '../services/productService';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProductEditPageProps {}

const ProductEditPage: React.FC<ProductEditPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [uploadedImages, setUploadedImages] = useState<ProductImage[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const isEditMode = Boolean(id && id !== 'new');

  // 加载产品数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 加载分类
        const categoriesData = await ProductService.getCategories();
        setCategories(categoriesData);

        // 加载标签
        const tagsData = await ProductService.getAllTags();
        setTags(tagsData);

        // 如果是编辑模式，加载产品数据
        if (isEditMode && id) {
          const productData = await ProductService.getProductByIdOrSlug(id);
          if (productData) {
            setProduct(productData);
            setUploadedImages(productData.images || []);
            
            // 填充表单
            form.setFieldsValue({
              name: productData.name,
              description: productData.description,
              category: productData.category,
              subcategory: productData.subcategory,
              tags: productData.tags,
              features: productData.features,
              specifications: productData.specifications,
            });
          } else {
            message.error('产品不存在');
            navigate('/admin/products');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode, form, navigate]);

  // 保存产品
  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      const productData = {
        ...values,
        images: uploadedImages,
        slug: values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };

      let savedProduct: Product;
      
      if (isEditMode && id) {
        savedProduct = await ProductService.updateProduct(id, productData);
        message.success('产品更新成功');
      } else {
        savedProduct = await ProductService.createProduct(productData);
        message.success('产品创建成功');
        navigate(`/admin/products/${savedProduct.id}/edit`);
      }
      
      setProduct(savedProduct);
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 删除产品
  const handleDelete = async () => {
    if (!isEditMode || !id) return;
    
    try {
      await ProductService.deleteProduct(id);
      message.success('产品删除成功');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('删除失败');
    }
  };

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    if (!product && !isEditMode) {
      message.warning('请先保存产品基本信息后再上传图片');
      return false;
    }

    try {
      const productId = product?.id || 'temp-' + Date.now();
      const imageUrl = await ProductService.uploadProductImage(file, productId);
      
      const newImage: ProductImage = {
        url: imageUrl,
        alt: file.name,
        isPrimary: uploadedImages.length === 0,
      };
      
      setUploadedImages(prev => [...prev, newImage]);
      message.success('图片上传成功');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('图片上传失败');
    }
    
    return false; // 阻止默认上传行为
  };

  // 删除图片
  const handleImageDelete = async (index: number) => {
    const image = uploadedImages[index];
    try {
      await ProductService.deleteProductImage(image.url);
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      message.success('图片删除成功');
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('图片删除失败');
    }
  };

  // 设置主图
  const handleSetPrimaryImage = (index: number) => {
    setUploadedImages(prev => 
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const currentTags = form.getFieldValue('tags') || [];
      form.setFieldsValue({ tags: [...currentTags, newTag] });
      setNewTag('');
    }
  };

  // 添加特性
  const handleAddFeature = () => {
    if (newFeature) {
      const currentFeatures = form.getFieldValue('features') || [];
      form.setFieldsValue({ features: [...currentFeatures, newFeature] });
      setNewFeature('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-6xl mx-auto p-6">
        {/* 页面头部 */}
        <div className="mb-6">
          <Space className="mb-4">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/products')}
            >
              返回产品列表
            </Button>
            {isEditMode && (
              <Button 
                icon={<EyeOutlined />} 
                onClick={() => navigate(`/product/${id}`)}
              >
                查看产品页面
              </Button>
            )}
          </Space>
          
          <Title level={2}>
            {isEditMode ? `编辑产品: ${product?.name || ''}` : '创建新产品'}
          </Title>
          
          {user && (
            <Text type="secondary">
              当前用户: {user.email}
            </Text>
          )}
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          size="large"
        >
          <Row gutter={24}>
            {/* 左侧：基本信息 */}
            <Col xs={24} lg={14}>
              <Card title="基本信息" className="mb-6">
                <Form.Item
                  name="name"
                  label="产品名称"
                  rules={[{ required: true, message: '请输入产品名称' }]}
                >
                  <Input placeholder="例如：Fimi X8T" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="产品描述"
                  rules={[{ required: true, message: '请输入产品描述' }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="详细描述产品的特点和用途..." 
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="主分类"
                      rules={[{ required: true, message: '请选择主分类' }]}
                    >
                      <Select placeholder="选择分类">
                        {categories.map(cat => (
                          <Option key={cat.id} value={cat.id}>
                            {cat.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="subcategory" label="子分类">
                      <Input placeholder="可选" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* 标签和特性 */}
              <Card title="标签和特性" className="mb-6">
                <Form.Item name="tags" label="产品标签">
                  <Select
                    mode="multiple"
                    placeholder="选择或输入标签"
                    style={{ width: '100%' }}
                  >
                    {tags.map(tag => (
                      <Option key={tag} value={tag}>{tag}</Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Space className="mb-4">
                  <Input
                    placeholder="添加新标签"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onPressEnter={handleAddTag}
                  />
                  <Button onClick={handleAddTag}>添加标签</Button>
                </Space>

                <Form.Item name="features" label="产品特性">
                  <Select
                    mode="multiple"
                    placeholder="添加产品特性"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Space>
                  <Input
                    placeholder="添加新特性"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onPressEnter={handleAddFeature}
                  />
                  <Button onClick={handleAddFeature}>添加特性</Button>
                </Space>
              </Card>

              {/* 规格参数 */}
              <Card title="规格参数">
                <Form.Item name="specifications" label="技术规格">
                  <TextArea 
                    rows={6} 
                    placeholder='请输入JSON格式的规格参数，例如：
{
  "重量": "743g",
  "最大飞行时间": "35分钟",
  "最大飞行距离": "8公里"
}'
                  />
                </Form.Item>
              </Card>
            </Col>

            {/* 右侧：图片管理 */}
            <Col xs={24} lg={10}>
              <Card title="产品图片" className="mb-6">
                <Upload
                  listType="picture-card"
                  beforeUpload={handleImageUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                </Upload>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded"
                        preview={{
                          visible: previewVisible && previewImage === image.url,
                          onVisibleChange: (visible) => {
                            setPreviewVisible(visible);
                            if (visible) setPreviewImage(image.url);
                          },
                        }}
                      />
                      
                      {image.isPrimary && (
                        <Tag color="blue" className="absolute top-1 left-1">
                          主图
                        </Tag>
                      )}
                      
                      <div className="absolute top-1 right-1 space-x-1">
                        {!image.isPrimary && (
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => handleSetPrimaryImage(index)}
                          >
                            设为主图
                          </Button>
                        )}
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleImageDelete(index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 操作按钮 */}
              <Card>
                <Space direction="vertical" className="w-full">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={saving}
                    icon={<SaveOutlined />}
                    size="large"
                    block
                  >
                    {saving ? '保存中...' : (isEditMode ? '更新产品' : '创建产品')}
                  </Button>
                  
                  {isEditMode && (
                    <Popconfirm
                      title="确定要删除这个产品吗？"
                      description="此操作不可撤销"
                      onConfirm={handleDelete}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="large"
                        block
                      >
                        删除产品
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </ProtectedRoute>
  );
};

export default ProductEditPage;