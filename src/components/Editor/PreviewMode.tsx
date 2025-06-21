import React from 'react';
import { Modal, Button, Space } from 'antd';
import { CloseOutlined, FullscreenOutlined } from '@ant-design/icons';
import { ContentBlock as ContentBlockType, TextBlockContent, ImageBlockContent, VideoBlockContent, ButtonBlockContent, DividerBlockContent, SpacerBlockContent } from '../../types/editor';

interface PreviewModeProps {
  visible: boolean;
  blocks: ContentBlockType[];
  onClose: () => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ visible, blocks, onClose }) => {
  const renderBlock = (block: ContentBlockType) => {
    switch (block.block_type) {
      case 'text':
        return renderTextBlock(block);
      case 'image':
        return renderImageBlock(block);
      case 'video':
        return renderVideoBlock(block);
      case 'button':
        return renderButtonBlock(block);
      case 'divider':
        return renderDividerBlock(block);
      case 'spacer':
        return renderSpacerBlock(block);
      default:
        return null;
    }
  };

  const renderTextBlock = (block: ContentBlockType) => {
    const content = block.content as TextBlockContent;
    return (
      <div
        key={block.id}
        style={{
          fontSize: content.fontSize || 16,
          fontWeight: content.fontWeight || 'normal',
          color: content.color || '#000',
          textAlign: content.textAlign || 'left',
          lineHeight: content.lineHeight || 1.5,
          marginBottom: 16,
          ...block.style_config
        }}
      >
        {content.text || ''}
      </div>
    );
  };

  const renderImageBlock = (block: ContentBlockType) => {
    const content = block.content as ImageBlockContent;
    if (!content.src) return null;
    
    return (
      <div
        key={block.id}
        style={{
          marginBottom: 16,
          textAlign: 'center',
          ...block.style_config
        }}
      >
        <img
          src={content.src}
          alt={content.alt || ''}
          style={{
            width: content.width || 'auto',
            height: content.height || 'auto',
            objectFit: content.objectFit || 'cover',
            maxWidth: '100%'
          }}
        />
      </div>
    );
  };

  const renderVideoBlock = (block: ContentBlockType) => {
    const content = block.content as VideoBlockContent;
    if (!content.src) return null;
    
    return (
      <div
        key={block.id}
        style={{
          marginBottom: 16,
          textAlign: 'center',
          ...block.style_config
        }}
      >
        <video
          src={content.src}
          poster={content.poster}
          controls={content.controls !== false}
          autoPlay={content.autoplay || false}
          loop={content.loop || false}
          style={{
            width: content.width || '100%',
            height: content.height || 'auto',
            maxWidth: '100%'
          }}
        />
      </div>
    );
  };

  const renderButtonBlock = (block: ContentBlockType) => {
    const content = block.content as ButtonBlockContent;
    if (!content.text) return null;
    
    return (
      <div
        key={block.id}
        style={{
          marginBottom: 16,
          textAlign: 'center',
          ...block.style_config
        }}
      >
        <Button
          type={content.variant === 'primary' ? 'primary' : content.variant === 'outline' ? 'default' : 'text'}
          size={content.size || 'middle'}
          href={content.href}
          target={content.target || '_self'}
          style={{
            backgroundColor: content.backgroundColor,
            borderColor: content.borderColor,
            color: content.textColor
          }}
        >
          {content.text}
        </Button>
      </div>
    );
  };

  const renderDividerBlock = (block: ContentBlockType) => {
    const content = block.content as DividerBlockContent;
    
    return (
      <div
        key={block.id}
        style={{
          marginBottom: 16,
          ...block.style_config
        }}
      >
        <hr
          style={{
            border: 'none',
            borderTop: `${content.thickness || 1}px ${content.style || 'solid'} ${content.color || '#d9d9d9'}`,
            margin: '16px 0'
          }}
        />
      </div>
    );
  };

  const renderSpacerBlock = (block: ContentBlockType) => {
    const content = block.content as SpacerBlockContent;
    
    return (
      <div
        key={block.id}
        style={{
          height: content.height || 20,
          backgroundColor: 'transparent',
          ...block.style_config
        }}
      />
    );
  };

  const openFullscreen = () => {
    const previewContent = document.getElementById('preview-content');
    if (previewContent && previewContent.requestFullscreen) {
      previewContent.requestFullscreen();
    }
  };

  return (
    <Modal
      title={
        <Space>
          <span>内容预览</span>
          <Button
            type="text"
            icon={<FullscreenOutlined />}
            onClick={openFullscreen}
            size="small"
          >
            全屏
          </Button>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
      width="80%"
      style={{ top: 20 }}
      bodyStyle={{
        maxHeight: '70vh',
        overflow: 'auto',
        padding: 0
      }}
    >
      <div
        id="preview-content"
        style={{
          padding: '24px',
          backgroundColor: '#fff',
          minHeight: '400px'
        }}
      >
        {blocks.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#999',
              fontSize: '16px',
              padding: '60px 0'
            }}
          >
            暂无内容，请先添加一些内容块
          </div>
        ) : (
          blocks
            .sort((a, b) => a.order_index - b.order_index)
            .map(renderBlock)
        )}
      </div>
    </Modal>
  );
};

export default PreviewMode;