import { cache } from 'react';
import symbolTags from '@/lib/extracted-metadata/symbol_tags.json';
import type { SymbolTagsData } from './transformers/types';

/**
 * Cached function that loads and returns symbol metadata for tooltip content.
 * Uses React.cache() for automatic memoization across server-side renders.
 * 
 * @returns Promise resolving to symbol metadata indexed by qualified name
 */
export const getTooltipContent = cache(async (): Promise<SymbolTagsData> => {
    return symbolTags as SymbolTagsData;
});
