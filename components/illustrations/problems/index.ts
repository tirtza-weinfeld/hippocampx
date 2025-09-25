/**
 * Problem-Specific Illustrations
 * Export all individual problem illustrations
 */

import { KokoEatingBananasIcon } from './koko-eating-bananas';
import { StockTradingIcon } from './stock-trading';
import { IllustrationProps } from '../type';
import { ComponentType } from 'react';


export const problemIllustrations:Record<string, ComponentType<IllustrationProps>>= {
  KokoEatingBananas: KokoEatingBananasIcon,
  BestTimeToBuyAndSellStock: StockTradingIcon,

  
  
};

