import { useReducer, useCallback, useEffect } from 'react';
import { ContentBlock, EditorState, EditorAction } from '../types/editor';
import { EditorService } from '../services/editorService';
import { message } from 'antd';

const initialState: EditorState = {
  blocks: [],
  selectedBlockId: undefined,
  editingBlockId: undefined,
  isDragging: false,
  isEditing: false,
  pageId: ''
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_BLOCK':
      return {
        ...state,
        blocks: [...state.blocks, action.payload].sort((a, b) => a.position_order - b.position_order)
      };

    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(block => 
          block.id === action.payload.id ? { ...block, ...action.payload } : block
        )
      };

    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.payload),
        selectedBlockId: state.selectedBlockId === action.payload ? undefined : state.selectedBlockId
      };

    case 'REORDER_BLOCKS':
      return {
        ...state,
        blocks: action.payload
      };

    case 'SELECT_BLOCK':
      return {
        ...state,
        selectedBlockId: action.payload
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload
      };

    case 'SET_EDITING':
      return {
        ...state,
        isEditing: action.payload
      };
    case 'SET_EDITING_BLOCK':
      return {
        ...state,
        editingBlockId: action.payload
      };

    default:
      return state;
  }
}

export function useEditor(pageId: string) {
  const [state, dispatch] = useReducer(editorReducer, { ...initialState, pageId });

  // 加载内容块
  const loadBlocks = useCallback(async () => {
    try {
      const blocks = await EditorService.getContentBlocks(pageId);
      dispatch({ type: 'REORDER_BLOCKS', payload: blocks });
    } catch (error) {
      message.error('加载内容块失败');
      console.error('加载内容块失败:', error);
    }
  }, [pageId]);

  // 添加新块
  const addBlock = useCallback(async (blockType: ContentBlock['block_type'], content: any = {}, styleConfig: any = {}) => {
    try {
      const maxOrder = Math.max(...state.blocks.map(b => b.position_order), 0);
      const newBlock = await EditorService.createContentBlock({
        page_id: pageId,
        block_type: blockType,
        content,
        position_order: maxOrder + 1,
        style_config: styleConfig,
        is_active: true
      });
      
      dispatch({ type: 'ADD_BLOCK', payload: newBlock });
      dispatch({ type: 'SELECT_BLOCK', payload: newBlock.id });
      return newBlock;
    } catch (error) {
      message.error('添加内容块失败');
      console.error('添加内容块失败:', error);
      throw error;
    }
  }, [pageId, state.blocks]);

   // 更新块
   const updateBlock = useCallback(async (id: string, updates: Partial<ContentBlock>) => {
     try {
       const updatedBlock = await EditorService.updateContentBlock(id, updates);
       dispatch({ type: 'UPDATE_BLOCK', payload: updatedBlock });
       return updatedBlock;
     } catch (error) {
       message.error('更新产品内容块失败');
       console.error('更新产品内容块失败:', error);
       throw error;
     }
   }, []);

   // 删除块
   const deleteBlock = useCallback(async (id: string) => {
     try {
       await EditorService.deleteContentBlock(id);
       dispatch({ type: 'DELETE_BLOCK', payload: id });
       message.success('产品内容块删除成功');
     } catch (error) {
       message.error('删除产品内容块失败');
       console.error('删除产品内容块失败:', error);
       throw error;
     }
   }, []);

   // 重新排序块
   const reorderBlocks = useCallback(async (newBlocks: ContentBlock[]) => {
     try {
       const updates = newBlocks.map((block, index) => ({
         id: block.id,
         position_order: index + 1
       }));
       
       await EditorService.updateBlocksOrder(updates);
       
       const reorderedBlocks = newBlocks.map((block, index) => ({
         ...block,
         position_order: index + 1
       }));
       
       dispatch({ type: 'REORDER_BLOCKS', payload: reorderedBlocks });
     } catch (error) {
       message.error('重新排序失败');
       console.error('重新排序失败:', error);
       throw error;
     }
   }, []);

   // 选择块
   const selectBlock = useCallback((id?: string) => {
     dispatch({ type: 'SELECT_BLOCK', payload: id });
   }, []);

   // 设置拖拽状态
   const setDragging = useCallback((isDragging: boolean) => {
     dispatch({ type: 'SET_DRAGGING', payload: isDragging });
   }, []);

   // 设置编辑状态
   const setEditing = useCallback((isEditing: boolean) => {
     dispatch({ type: 'SET_EDITING', payload: isEditing });
   }, []);

   const setEditingBlock = useCallback((blockId?: string) => {
     dispatch({ type: 'SET_EDITING_BLOCK', payload: blockId });
   }, []);

   // 保存所有块
   const saveBlocks = useCallback(async () => {
     try {
       message.success('产品内容保存成功');
       return true;
     } catch (error) {
       message.error('保存失败');
       console.error('保存失败:', error);
       throw error;
     }
   }, []);

   // 上传图片
   const uploadImage = useCallback(async (file: File, path?: string) => {
     try {
       const url = await EditorService.uploadImage(file, path);
       message.success('图片上传成功');
       return url;
     } catch (error) {
       message.error('图片上传失败');
       console.error('图片上传失败:', error);
       throw error;
     }
   }, []);

   // 初始化时加载数据
   useEffect(() => {
     if (pageId) {
       loadBlocks();
     }
   }, [pageId, loadBlocks]);

   return {
     state,
     loadBlocks,
     addBlock,
     updateBlock,
     deleteBlock,
     reorderBlocks,
     selectBlock,
     setDragging,
     setEditing,
     setEditingBlock,
     saveBlocks,
     uploadImage
   };
 }

/**
 * 专门用于产品内容编辑的 hook
 */
export function useProductEditor(productId: string) {
  const [state, dispatch] = useReducer(editorReducer, { ...initialState, pageId: `product-${productId}` });

  // 加载产品内容块
  const loadBlocks = useCallback(async () => {
    try {
      const blocks = await EditorService.getProductContentBlocks(productId);
      dispatch({ type: 'REORDER_BLOCKS', payload: blocks });
    } catch (error) {
      message.error('加载产品内容块失败');
      console.error('加载产品内容块失败:', error);
    }
  }, [productId]);

  // 添加新块
  const addBlock = useCallback(async (blockType: ContentBlock['block_type'], content: any = {}, styleConfig: any = {}) => {
    try {
      const maxOrder = Math.max(...state.blocks.map(b => b.position_order), 0);
      const newBlock = await EditorService.createContentBlock({
        page_id: `product-${productId}`,
        product_id: productId,
        block_type: blockType,
        content,
        position_order: maxOrder + 1,
        style_config: styleConfig,
        is_active: true
      });
      
      dispatch({ type: 'ADD_BLOCK', payload: newBlock });
      dispatch({ type: 'SELECT_BLOCK', payload: newBlock.id });
      return newBlock;
    } catch (error) {
      message.error('添加产品内容块失败');
      console.error('添加产品内容块失败:', error);
      throw error;
    }
  }, [productId, state.blocks]);

  // 更新块
  const updateBlock = useCallback(async (id: string, updates: Partial<ContentBlock>) => {
    try {
      const updatedBlock = await EditorService.updateContentBlock(id, updates);
      dispatch({ type: 'UPDATE_BLOCK', payload: updatedBlock });
      return updatedBlock;
    } catch (error) {
      message.error('更新内容块失败');
      console.error('更新内容块失败:', error);
      throw error;
    }
  }, []);

  // 删除块
  const deleteBlock = useCallback(async (id: string) => {
    try {
      await EditorService.deleteContentBlock(id);
      dispatch({ type: 'DELETE_BLOCK', payload: id });
      message.success('内容块删除成功');
    } catch (error) {
      message.error('删除内容块失败');
      console.error('删除内容块失败:', error);
      throw error;
    }
  }, []);

  // 重新排序块
  const reorderBlocks = useCallback(async (newBlocks: ContentBlock[]) => {
    try {
      const updates = newBlocks.map((block, index) => ({
        id: block.id,
        position_order: index + 1
      }));
      
      await EditorService.updateBlocksOrder(updates);
      
      const reorderedBlocks = newBlocks.map((block, index) => ({
        ...block,
        position_order: index + 1
      }));
      
      dispatch({ type: 'REORDER_BLOCKS', payload: reorderedBlocks });
    } catch (error) {
      message.error('重新排序失败');
      console.error('重新排序失败:', error);
      throw error;
    }
  }, []);

  // 选择块
  const selectBlock = useCallback((id?: string) => {
    dispatch({ type: 'SELECT_BLOCK', payload: id });
  }, []);

  // 设置拖拽状态
  const setDragging = useCallback((isDragging: boolean) => {
    dispatch({ type: 'SET_DRAGGING', payload: isDragging });
  }, []);

  // 设置编辑状态
  const setEditing = useCallback((isEditing: boolean) => {
    dispatch({ type: 'SET_EDITING', payload: isEditing });
  }, []);

  const setEditingBlock = useCallback((blockId?: string) => {
    dispatch({ type: 'SET_EDITING_BLOCK', payload: blockId });
  }, []);

  // 保存所有块
  const saveBlocks = useCallback(async () => {
    try {
      // 这里可以添加批量保存逻辑，目前只是一个占位符
      message.success('内容保存成功');
      return true;
    } catch (error) {
      message.error('保存失败');
      console.error('保存失败:', error);
      throw error;
    }
  }, []);

  // 上传图片
  const uploadImage = useCallback(async (file: File, path?: string) => {
    try {
      const url = await EditorService.uploadImage(file, path);
      message.success('图片上传成功');
      return url;
    } catch (error) {
      message.error('图片上传失败');
      console.error('图片上传失败:', error);
      throw error;
    }
  }, []);

  // 初始化时加载数据
  useEffect(() => {
    if (productId) {
      loadBlocks();
    }
  }, [productId, loadBlocks]);

  return {
    state,
    loadBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    setDragging,
    setEditing,
    setEditingBlock,
    saveBlocks,
    uploadImage
  };
}