export interface ContentBlock {
  id: string;
  page_id: string;
  product_id?: string; // 关联的产品ID，用于产品内容编辑
  block_type: 'text' | 'image' | 'video' | 'button' | 'divider' | 'spacer';
  content: Record<string, any>;
  position_order: number;
  style_config: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
}

export interface TextBlockContent {
  text: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'bolder';
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
}

export interface ImageBlockContent {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
}

export interface VideoBlockContent {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
}

export interface ButtonBlockContent {
  text: string;
  href?: string;
  target?: '_blank' | '_self';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export interface DividerBlockContent {
  thickness?: number;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface SpacerBlockContent {
  height: number;
}

export interface BlockStyleConfig {
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  backgroundColor?: string;
  borderRadius?: number;
  border?: {
    width?: number;
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
  };
  boxShadow?: string;
}

export interface DragItem {
  id: string;
  type: string;
  index: number;
}

export interface DropResult {
  droppedId: string;
  targetId?: string;
  position: 'before' | 'after' | 'inside';
}

export interface EditorState {
  blocks: ContentBlock[];
  selectedBlockId?: string;
  editingBlockId?: string;
  isDragging: boolean;
  isEditing: boolean;
  pageId: string;
}

export interface EditorAction {
  type: 'ADD_BLOCK' | 'UPDATE_BLOCK' | 'DELETE_BLOCK' | 'REORDER_BLOCKS' | 'SELECT_BLOCK' | 'SET_DRAGGING' | 'SET_EDITING' | 'SET_EDITING_BLOCK';
  payload?: any;
}