import React from 'react';
import { Layout, Typography, Card } from 'antd';
import { DragEditor } from '../components/Editor';
import { useLanguage } from '../contexts/LanguageContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const EditorPage: React.FC = () => {
  const { t } = useLanguage();

  const handleSave = (blocks: any[]) => {
    console.log('保存的内容块:', blocks);
    // 这里可以添加保存到服务器的逻辑
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Card
            style={{
              marginBottom: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Title level={2} style={{ marginBottom: '8px' }}>
              拖拽内容编辑器
            </Title>
            <Paragraph style={{ color: '#666', marginBottom: 0 }}>
              使用拖拽功能创建和编辑内容。支持文本、图片、视频、按钮、分割线和间距等多种内容类型。
            </Paragraph>
          </Card>

          <Card
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
            styles={{ body: { padding: 0 } }}
          >
            <DragEditor
              pageId="demo-page"
              onSave={handleSave}
              readOnly={false}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default EditorPage;