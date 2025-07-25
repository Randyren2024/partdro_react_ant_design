import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  Tag, 
  Descriptions, 
  Card, 
  Space, 
  Carousel, 
  Spin,
  Modal,
  Form,
  Input,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  HeartOutlined,
  ShareAltOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from '../components/Product/ProductCard';
import Breadcrumb from '../components/Layout/Breadcrumb';
import { Product } from '../types/product';
import { ProductService } from '../services/productService';
import { isUUID } from '../utils/urlUtils';
import ContactForm from '../components/common/ContactForm';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { getLocalizedText, getLocalizedArray } = useLanguage();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id, navigate]);

  const loadProduct = async (identifier: string) => {
    setLoading(true);
    try {
      const productData = await ProductService.getProductByIdOrSlug(identifier);
      
      if (productData) {
        setProduct(productData);
        // Store localized product name in localStorage for breadcrumb
        const localizedName = getLocalizedText(productData.name_i18n || {}, productData.name);
        localStorage.setItem(`productName-${productData.id}`, localizedName);
        // Load related products
        const related = await ProductService.getRelatedProducts(
          productData.id, 
          productData.category, 
          3
        );
        setRelatedProducts(related);
        
        // If accessed by UUID but product has slug, redirect to slug URL
        if (productData.slug && identifier !== productData.slug && isUUID(identifier)) {
          navigate(`/product/${productData.slug}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async (values: any) => {
    try {
      // In a real app, this would send the inquiry to your backend
      console.log('Inquiry submitted:', values);
      message.success('Your inquiry has been submitted successfully!');
      setInquiryVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit inquiry. Please try again.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <Title level={3}>Product not found</Title>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb />
      
      {/* Back Button */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        Back to Products
      </Button>

      <Row gutter={[48, 48]}>
        {/* Product Images */}
        <Col xs={24} lg={12}>
          <div className="sticky top-24">
            <Carousel
              arrows
              dots={{ className: 'custom-dots' }}
              className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              {product.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-96 object-cover"
                  />
                </div>
              ))}
            </Carousel>

            {/* Video Section */}
            {product.video_url && (
              <Card className={`mt-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <Button
                  type="link"
                  icon={<PlayCircleOutlined />}
                  href={product.video_url}
                  target="_blank"
                  className="text-lg p-0"
                >
                  Watch Product Demo
                </Button>
              </Card>
            )}
          </div>
        </Col>

        {/* Product Details */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" className="w-full">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                          <Title level={1} className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {getLocalizedText(product.name_i18n || {}, product.name)}
              </Title>
              <Space>
                <Tag color="blue" className="capitalize">
                  {product.category}
                </Tag>
                {product.subcategory && (
                  <Tag color="cyan" className="capitalize">
                    {t(`categories.${product.subcategory}`)}
                  </Tag>
                )}
              </Space>
            </div>
            <Space>
              <Button
                icon={<HeartOutlined />}
                type="text"
                className={isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}
              />
              <Button
                icon={<ShareAltOutlined />}
                type="text"
                onClick={handleShare}
                className={isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-cyan-600'}
              />
            </Space>
          </div>


            </div>

            {/* Description */}
            <div>
              <Title level={4} className={isDark ? 'text-white' : 'text-gray-900'}>
                Description
              </Title>
              <Paragraph className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed`}>
                {getLocalizedText(product.description_i18n || {}, product.description)}
              </Paragraph>
            </div>

            {/* Tags */}
            <div>
              <Title level={5} className={isDark ? 'text-white' : 'text-gray-900'}>
                {t('product.tags')}
              </Title>
              <Space wrap>
                {getLocalizedArray(product.tags_i18n || {}, product.tags).map((tag, index) => (
                  <Tag
                    key={`${tag}-${index}`}
                    color="cyan"
                    className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30"
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>

            {/* Key Features */}
            <div>
              <Title level={4} className={isDark ? 'text-white' : 'text-gray-900'}>
                {t('product.features')}
              </Title>
              <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-2`}>
                {getLocalizedArray(product.features_i18n || {}, product.features).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <Space size="large" className="w-full">
              <Button
                type="primary"
                size="large"
                onClick={() => window.open('https://api.whatsapp.com/send?phone=8613362853598', '_blank')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 border-none h-12 px-8 flex-1"
              >
                {t('product.inquireNow')}
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* Technical Specifications */}
      <Row className="mt-16">
        <Col span={24}>
          <Card 
            title={
              <Title level={3} className={`mb-0 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('product.specifications')}
              </Title>
            }
            className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}
          >
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2, lg: 3 }}
              size="middle"
            >
              {(() => {
                // Get localized specifications based on current language
                const currentLang = i18n.language;
                const localizedSpecs = product.specifications_i18n?.[currentLang] || 
                                     product.specifications_i18n?.['en'] || 
                                     product.specifications || {};
                
                return Object.entries(localizedSpecs).map(([key, value]) => (
                  <Descriptions.Item
                    key={key}
                    label={<Text strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>}
                    className={isDark ? 'text-gray-300' : 'text-gray-700'}
                  >
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </Descriptions.Item>
                ));
              })()}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <Title level={3} className={`mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('product.relatedProducts')}
          </Title>
          <Row gutter={[24, 24]}>
            {relatedProducts.map((relatedProduct) => (
              <Col xs={24} sm={12} lg={8} key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Inquiry Modal */}
      <Modal
        title="Product Inquiry"
        open={inquiryVisible}
        onCancel={() => setInquiryVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInquiry}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            name="company"
            label="Company (Optional)"
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number (Optional)"
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <TextArea
              rows={4}
              placeholder={`I'm interested in the ${product.name}. Please provide more information about specifications and availability.`}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setInquiryVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Send Inquiry
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Contact Form */}
      <Card 
        title={t('contact.title')}
        className={`mt-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
      >
        <ContactForm pageName={`Product Detail - ${getLocalizedText(product.name_i18n || {}, product.name)}`} />
      </Card>
    </div>
  );
};

export default ProductDetailPage;