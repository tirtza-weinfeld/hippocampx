import type { SymbolMetadata } from '@/lib/types';
import { cache } from 'react';
import codeMetadata from '@/lib/extracted-metadata/code_metadata.json';
import testMetadata from '@/lib/extracted-metadata/test_tooltips_metadata.json';

export const getTooltipContent = cache(async () => {
    // Use test metadata if we're in a test environment
    const metadata = process.env.NODE_ENV === 'test' 
        ? testMetadata
        : codeMetadata;
    
    return metadata as Record<string, SymbolMetadata>;
});
