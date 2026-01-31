/**
 * Problem-Specific Illustrations
 * Export all individual problem illustrations
 */

import { KokoEatingBananasIcon } from './koko-eating-bananas';
import { StockTradingIcon } from './stock-trading';
import { IllustrationProps } from '../type';
import { ComponentType } from 'react';

export { InorderTraversalIllustration } from './94-binary-tree-inorder-traversal';
export { ConstructBinaryTreeIllustration } from './105-construct-binary-tree-from-preorder-and-inorder-traversal';
export { PreorderTraversalIllustration } from './144-binary-tree-preorder-traversal';
export { PostorderTraversalIllustration } from './145-binary-tree-postorder-traversal';
export { ConstructBinaryTreePrePostIllustration } from './889-construct-binary-tree-from-preorder-and-postorder-traversal';

export const problemIllustrations:Record<string, ComponentType<IllustrationProps>>= {
  KokoEatingBananas: KokoEatingBananasIcon,
  BestTimeToBuyAndSellStock: StockTradingIcon,

  
  
};

