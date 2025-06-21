import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout, Spin, message, Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEditor } from '../../hooks/useEditor';
import { ContentBlock as ContentBlockType } from '../../types/editor';
import ContentBlock from './ContentBlock';
import Toolbar from './Toolbar';
import PreviewMode from './PreviewMode';
import './DragEditor.css';

const { Content } = Layout;

interface DragEditorProps {
  pageId?: string;
  initialBlocks?: ContentBlockType[];
  onSave?: (blocks: ContentBlockType[]) => void;
  readOnly?: boolean;
}

const DragEditor: React.FC<DragEditorProps> = ({
  pageId = 'default-page',
  initialBlocks = [],
  onSave,
  readOnly = false
}) => {
  try {
    const editorHook = useEditor(pageId);
    
    if (!editorHook) {
      return <div>Loading editor...</div>;
    }
  
  const {
    state,
    loadBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    setEditingBlock,
    setDragging,
    saveBlocks
  } = editorHook;

  const [previewVisible, setPreviewVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (pageId) {
      loadBlocks();
    } else if (initialBlocks.length > 0) {
      // 如果没有 pageId 但有初始数据，直接使用初始数据
      initialBlocks.forEach(block => {
        addBlock(block.block_type, block.content, block.style_config);
      });
    }
  }, [pageId, initialBlocks]);

  const handleAddBlock = (type: ContentBlockType['block_type']) => {
    const defaultContent = getDefaultContent(type);
    addBlock(type, defaultContent);
  };

  const getDefaultContent = (type: ContentBlockType['block_type']) => {
    switch (type) {
      case 'text':
        return {
          text: '请输入文本内容',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          textAlign: 'left',
          lineHeight: 1.5
        };
      case 'image':
        return {
          src: '',
          alt: '',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover'
        };
      case 'video':
        return {
          src: '',
          poster: '',
          controls: true,
          autoplay: false,
          loop: false,
          width: '100%',
          height: 'auto'
        };
      case 'button':
        return {
          text: '按钮',
          href: '',
          target: '_self',
          variant: 'primary',
          size: 'medium'
        };
      case 'divider':
        return {
          thickness: 1,
          color: '#d9d9d9',
          style: 'solid'
        };
      case 'spacer':
        return {
          height: 20
        };
      default:
        return {};
    }
  };

  const handleSave = async () => {
    if (readOnly) return;
    
    setIsSaving(true);
    try {
      await saveBlocks();
      if (onSave) {
        onSave(state.blocks);
      }
      message.success('保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveBlock = (dragIndex: number, hoverIndex: number) => {
    if (readOnly) return;
    reorderBlocks(dragIndex, hoverIndex);
  };

  const handleSelectBlock = (id: string) => {
    if (readOnly) return;
    selectBlock(id);
  };

  const handleEditBlock = (id: string) => {
    if (readOnly) return;
    setEditingBlock(id);
  };

  const handleUpdateBlock = (id: string, updates: Partial<ContentBlockType>) => {
    if (readOnly) return;
    updateBlock(id, updates);
  };

  const handleDeleteBlock = (id: string) => {
    if (readOnly) return;
    deleteBlock(id);
  };

  const handleUndo = () => {
    // TODO: 实现撤销功能
    message.info('撤销功能开发中');
  };

  const handleRedo = () => {
    // TODO: 实现重做功能
    message.info('重做功能开发中');
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  if (state.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout className="drag-editor">
        {!readOnly && (
          <Toolbar
            onAddBlock={handleAddBlock}
            onSave={handleSave}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onPreview={handlePreview}
            canUndo={false} // TODO: 实现撤销重做状态
            canRedo={false}
            isSaving={isSaving}
          />
        )}
        
        <Content
          style={{
            padding: '24px',
            minHeight: '500px',
            backgroundColor: '#fff'
          }}
        >
          {state.blocks.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  {readOnly ? '暂无内容' : '还没有内容，开始创建吧！'}
                </span>
              }
            >
              {!readOnly && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddBlock('text')}
                >
                  添加第一个内容块
                </Button>
              )}
            </Empty>
          ) : (
            <div className="content-blocks">
              {state.blocks
                .sort((a, b) => a.order_index - b.order_index)
                .map((block, index) => (
                  <ContentBlock
                    key={block.id}
                    block={block}
                    index={index}
                    isSelected={state.selectedBlockId === block.id}
                    isEditing={state.editingBlockId === block.id}
                    onSelect={handleSelectBlock}
                    onEdit={handleEditBlock}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                    onMove={handleMoveBlock}
                  />
                ))
              }
            </div>
          )}
        </Content>

        <PreviewMode
          visible={previewVisible}
          blocks={state.blocks}
          onClose={() => setPreviewVisible(false)}
        />
      </Layout>
    </DndProvider>
  );
  } catch (error) {
    console.error('DragEditor error:', error);
    return <div>Error loading editor: {error.message}</div>;
  }
};

export default DragEditor;