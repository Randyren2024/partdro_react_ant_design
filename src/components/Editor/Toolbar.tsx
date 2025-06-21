import React from 'react';
import { Button, Space, Tooltip, Divider } from 'antd';
import {
  FontSizeOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  LinkOutlined,
  MinusOutlined,
  ColumnHeightOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { ContentBlock } from '../../types/editor';

interface ToolbarProps {
  onAddBlock: (type: ContentBlock['block_type']) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddBlock,
  onSave,
  onUndo,
  onRedo,
  onPreview,
  canUndo,
  canRedo,
  isSaving
}) => {
  const blockTypes = [
    {
      type: 'text' as const,
      icon: <FontSizeOutlined />,
      label: '文本',
      description: '添加文本内容'
    },
    {
      type: 'image' as const,
      icon: <PictureOutlined />,
      label: '图片',
      description: '添加图片'
    },
    {
      type: 'video' as const,
      icon: <PlayCircleOutlined />,
      label: '视频',
      description: '添加视频'
    },
    {
      type: 'button' as const,
      icon: <LinkOutlined />,
      label: '按钮',
      description: '添加按钮链接'
    },
    {
      type: 'divider' as const,
      icon: <MinusOutlined />,
      label: '分割线',
      description: '添加分割线'
    },
    {
      type: 'spacer' as const,
      icon: <ColumnHeightOutlined />,
      label: '间距',
      description: '添加空白间距'
    }
  ];

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #d9d9d9',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <Space split={<Divider type="vertical" />} wrap>
        {/* 操作按钮 */}
        <Space>
          <Tooltip title="保存">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={onSave}
              loading={isSaving}
            >
              保存
            </Button>
          </Tooltip>
          
          <Tooltip title="预览">
            <Button
              icon={<EyeOutlined />}
              onClick={onPreview}
            >
              预览
            </Button>
          </Tooltip>
        </Space>

        {/* 撤销重做 */}
        <Space>
          <Tooltip title="撤销">
            <Button
              icon={<UndoOutlined />}
              onClick={onUndo}
              disabled={!canUndo}
            />
          </Tooltip>
          
          <Tooltip title="重做">
            <Button
              icon={<RedoOutlined />}
              onClick={onRedo}
              disabled={!canRedo}
            />
          </Tooltip>
        </Space>

        {/* 内容块类型 */}
        <Space wrap>
          <span style={{ fontWeight: 'bold', color: '#666' }}>添加内容:</span>
          {blockTypes.map((blockType) => (
            <Tooltip key={blockType.type} title={blockType.description}>
              <Button
                icon={blockType.icon}
                onClick={() => onAddBlock(blockType.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {blockType.label}
              </Button>
            </Tooltip>
          ))}
        </Space>
      </Space>
    </div>
  );
};

export default Toolbar;