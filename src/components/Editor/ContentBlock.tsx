import React, { useRef, useState } from 'react';
import { Card, Button, Space, Popconfirm, Input, Upload, ColorPicker, Slider, Select } from 'antd';
import { EditOutlined, DeleteOutlined, DragOutlined, PlusOutlined } from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';
import { ContentBlock as ContentBlockType, TextBlockContent, ImageBlockContent, VideoBlockContent, ButtonBlockContent, DividerBlockContent, SpacerBlockContent } from '../../types/editor';
import { useEditor } from '../../hooks/useEditor';

interface ContentBlockProps {
  block: ContentBlockType;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ContentBlockType>) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  index: number;
}

const { TextArea } = Input;
const { Option } = Select;

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onUpdate,
  onMove,
  index
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [editingContent, setEditingContent] = useState(block.content);
  const [editingStyle, setEditingStyle] = useState(block.style_config);

  const [{ isDragging }, drag] = useDrag({
    type: 'content-block',
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'content-block',
    hover: (item: { id: string; index: number }) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleSave = () => {
    onUpdate(block.id, {
      content: editingContent,
      style_config: editingStyle
    });
    onEdit('');
  };

  const handleCancel = () => {
    setEditingContent(block.content);
    setEditingStyle(block.style_config);
    onEdit('');
  };

  const renderContent = () => {
    if (isEditing) {
      return renderEditingContent();
    }

    switch (block.block_type) {
      case 'text':
        return renderTextContent();
      case 'image':
        return renderImageContent();
      case 'video':
        return renderVideoContent();
      case 'button':
        return renderButtonContent();
      case 'divider':
        return renderDividerContent();
      case 'spacer':
        return renderSpacerContent();
      default:
        return <div>未知内容类型</div>;
    }
  };

  const renderTextContent = () => {
    const content = block.content as TextBlockContent;
    return (
      <div
        style={{
          fontSize: content.fontSize || 16,
          fontWeight: content.fontWeight || 'normal',
          color: content.color || '#000',
          textAlign: content.textAlign || 'left',
          lineHeight: content.lineHeight || 1.5,
        }}
      >
        {content.text || '点击编辑文本'}
      </div>
    );
  };

  const renderImageContent = () => {
    const content = block.content as ImageBlockContent;
    return (
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
    );
  };

  const renderVideoContent = () => {
    const content = block.content as VideoBlockContent;
    return (
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
    );
  };

  const renderButtonContent = () => {
    const content = block.content as ButtonBlockContent;
    return (
      <Button
        type={content.variant === 'primary' ? 'primary' : content.variant === 'outline' ? 'default' : 'text'}
        size={content.size || 'middle'}
        href={content.href}
        target={content.target || '_self'}
      >
        {content.text || '按钮'}
      </Button>
    );
  };

  const renderDividerContent = () => {
    const content = block.content as DividerBlockContent;
    return (
      <hr
        style={{
          border: 'none',
          borderTop: `${content.thickness || 1}px ${content.style || 'solid'} ${content.color || '#d9d9d9'}`,
          margin: '16px 0'
        }}
      />
    );
  };

  const renderSpacerContent = () => {
    const content = block.content as SpacerBlockContent;
    return (
      <div
        style={{
          height: content.height || 20,
          backgroundColor: 'transparent'
        }}
      />
    );
  };

  const renderEditingContent = () => {
    switch (block.block_type) {
      case 'text':
        return renderTextEditor();
      case 'image':
        return renderImageEditor();
      case 'video':
        return renderVideoEditor();
      case 'button':
        return renderButtonEditor();
      case 'divider':
        return renderDividerEditor();
      case 'spacer':
        return renderSpacerEditor();
      default:
        return <div>不支持编辑此类型</div>;
    }
  };

  const renderTextEditor = () => {
    const content = editingContent as TextBlockContent;
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          value={content.text}
          onChange={(e) => setEditingContent({ ...content, text: e.target.value })}
          placeholder="输入文本内容"
          rows={4}
        />
        <Space wrap>
          <span>字体大小:</span>
          <Slider
            min={12}
            max={48}
            value={content.fontSize || 16}
            onChange={(value) => setEditingContent({ ...content, fontSize: value })}
            style={{ width: 100 }}
          />
          <span>颜色:</span>
          <ColorPicker
            value={content.color || '#000'}
            onChange={(color) => setEditingContent({ ...content, color: color.toHexString() })}
          />
          <span>对齐:</span>
          <Select
            value={content.textAlign || 'left'}
            onChange={(value) => setEditingContent({ ...content, textAlign: value })}
            style={{ width: 80 }}
          >
            <Option value="left">左对齐</Option>
            <Option value="center">居中</Option>
            <Option value="right">右对齐</Option>
          </Select>
        </Space>
      </Space>
    );
  };

  const renderImageEditor = () => {
    const content = editingContent as ImageBlockContent;
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={content.src}
          onChange={(e) => setEditingContent({ ...content, src: e.target.value })}
          placeholder="图片URL"
        />
        <Input
          value={content.alt}
          onChange={(e) => setEditingContent({ ...content, alt: e.target.value })}
          placeholder="图片描述"
        />
        <Space>
          <span>宽度:</span>
          <Input
            type="number"
            value={content.width}
            onChange={(e) => setEditingContent({ ...content, width: Number(e.target.value) })}
            placeholder="宽度"
            style={{ width: 80 }}
          />
          <span>高度:</span>
          <Input
            type="number"
            value={content.height}
            onChange={(e) => setEditingContent({ ...content, height: Number(e.target.value) })}
            placeholder="高度"
            style={{ width: 80 }}
          />
        </Space>
      </Space>
    );
  };

  const renderVideoEditor = () => {
    const content = editingContent as VideoBlockContent;
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={content.src}
          onChange={(e) => setEditingContent({ ...content, src: e.target.value })}
          placeholder="视频URL"
        />
        <Input
          value={content.poster}
          onChange={(e) => setEditingContent({ ...content, poster: e.target.value })}
          placeholder="封面图URL"
        />
      </Space>
    );
  };

  const renderButtonEditor = () => {
    const content = editingContent as ButtonBlockContent;
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={content.text}
          onChange={(e) => setEditingContent({ ...content, text: e.target.value })}
          placeholder="按钮文本"
        />
        <Input
          value={content.href}
          onChange={(e) => setEditingContent({ ...content, href: e.target.value })}
          placeholder="链接地址"
        />
        <Space>
          <span>样式:</span>
          <Select
            value={content.variant || 'primary'}
            onChange={(value) => setEditingContent({ ...content, variant: value })}
            style={{ width: 100 }}
          >
            <Option value="primary">主要</Option>
            <Option value="secondary">次要</Option>
            <Option value="outline">边框</Option>
          </Select>
          <span>大小:</span>
          <Select
            value={content.size || 'medium'}
            onChange={(value) => setEditingContent({ ...content, size: value })}
            style={{ width: 80 }}
          >
            <Option value="small">小</Option>
            <Option value="medium">中</Option>
            <Option value="large">大</Option>
          </Select>
        </Space>
      </Space>
    );
  };

  const renderDividerEditor = () => {
    const content = editingContent as DividerBlockContent;
    return (
      <Space wrap>
        <span>粗细:</span>
        <Slider
          min={1}
          max={10}
          value={content.thickness || 1}
          onChange={(value) => setEditingContent({ ...content, thickness: value })}
          style={{ width: 100 }}
        />
        <span>颜色:</span>
        <ColorPicker
          value={content.color || '#d9d9d9'}
          onChange={(color) => setEditingContent({ ...content, color: color.toHexString() })}
        />
        <span>样式:</span>
        <Select
          value={content.style || 'solid'}
          onChange={(value) => setEditingContent({ ...content, style: value })}
          style={{ width: 80 }}
        >
          <Option value="solid">实线</Option>
          <Option value="dashed">虚线</Option>
          <Option value="dotted">点线</Option>
        </Select>
      </Space>
    );
  };

  const renderSpacerEditor = () => {
    const content = editingContent as SpacerBlockContent;
    return (
      <Space>
        <span>高度:</span>
        <Slider
          min={10}
          max={200}
          value={content.height || 20}
          onChange={(value) => setEditingContent({ ...content, height: value })}
          style={{ width: 200 }}
        />
        <span>{content.height || 20}px</span>
      </Space>
    );
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        marginBottom: 8,
        ...block.style_config
      }}
    >
      <Card
        size="small"
        className={`content-block ${isSelected ? 'selected' : ''}`}
        style={{
          border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
          cursor: 'pointer'
        }}
        onClick={() => onSelect(block.id)}
        extra={
          isSelected && (
            <Space>
              <Button
                type="text"
                size="small"
                icon={<DragOutlined />}
                style={{ cursor: 'grab' }}
              />
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(block.id);
                }}
              />
              <Popconfirm
                title="确定删除这个内容块吗？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onDelete(block.id);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </Space>
          )
        }
      >
        {renderContent()}
        
        {isEditing && (
          <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <Space>
              <Button type="primary" size="small" onClick={handleSave}>
                保存
              </Button>
              <Button size="small" onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContentBlock;