import { describe, it, expect, beforeEach } from 'vitest';
import { transformerCodeTooltipWords } from '@/components/mdx/code/transformers/meta-tooltip';
import type { SymbolMetadata } from '@/lib/types';

describe('transformerCodeTooltipWords', () => {
  let mockTooltipMap: Record<string, SymbolMetadata>;

  beforeEach(() => {
    mockTooltipMap = {
      'test_function': {
        name: 'test_function',
        type: 'function',
        language: 'python',
        file: 'test.py',
        line: 1,
        signature: 'def test_function(x: int) -> int:',
        parameters: [
          {
            name: 'x',
            type: 'int',
            description: 'Input parameter',
            default: null
          }
        ],
        return_type: 'int',
        return_description: 'Result',
        description: 'Test function',
        code: 'def test_function(x: int) -> int:\n    return x',
        variables: [],
        expressions: []
      }
    };
  });

  it('should create a Shiki transformer with correct name', () => {
    const transformer = transformerCodeTooltipWords(mockTooltipMap);
    expect(transformer.name).toBe('meta-tooltip');
    expect(typeof transformer.preprocess).toBe('function');
  });

  it('should add decorations for function symbols', () => {
    const transformer = transformerCodeTooltipWords(mockTooltipMap);
    const code = 'def test_function(x: int) -> int:\n    return x';
    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, code, options);
      
      // Should find function name decorations
      const functionDecorations = options.decorations.filter((d: any) => 
        d.properties['data-tooltip-symbol'] === 'test_function'
      );
      expect(functionDecorations.length).toBeGreaterThan(0);
      expect(functionDecorations[0].properties['data-tooltip-type']).toBe('function');
    }
  });

  it('should add decorations for parameters with descriptions', () => {
    const transformer = transformerCodeTooltipWords(mockTooltipMap);
    const code = 'def test_function(x: int) -> int:\n    return x';
    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, code, options);
      
      // Should find parameter decorations within function scope
      const paramDecorations = options.decorations.filter((d: any) => 
        d.properties['data-tooltip-symbol'] === 'x' &&
        d.properties['data-tooltip-type'] === 'parameter'
      );
      expect(paramDecorations.length).toBeGreaterThan(0);
      expect(paramDecorations[0].properties['data-tooltip-parent']).toBe('test_function');
    }
  });

  it('should handle empty tooltip map gracefully', () => {
    const transformer = transformerCodeTooltipWords({});
    const code = 'def some_function():\n    pass';
    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, code, options);
      expect(options.decorations).toHaveLength(0);
    }
  });

  it('should handle code without matching functions', () => {
    const transformer = transformerCodeTooltipWords(mockTooltipMap);
    const code = 'print("Hello World")\nx = 5';
    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, code, options);
      expect(options.decorations).toHaveLength(0);
    }
  });

  it('should add tooltip-symbol class to all decorations', () => {
    const transformer = transformerCodeTooltipWords(mockTooltipMap);
    const code = 'def test_function(x: int) -> int:\n    return x';
    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, code, options);
      
      for (const decoration of options.decorations) {
        expect(decoration.properties.class).toBe('tooltip-symbol');
      }
    }
  });

  it('should NOT apply variable tooltips to standalone code blocks that do not contain the parent function', () => {
    // This reproduces the bug: dp variable from DP.minimumTotal getting tooltips 
    // in the Coin Change II standalone code block
    const tooltipMapWithDP: Record<string, SymbolMetadata> = {
      'DP.minimumTotal': {
        name: 'minimumTotal',
        type: 'method',
        language: 'python',
        file: 'dp.py',
        line: 3,
        signature: 'def minimumTotal(self, triangle: list[list[int]]) -> int:',
        parameters: [],
        return_type: 'int',
        return_description: 'minimum path sum',
        description: 'Find minimum path sum in triangle',
        code: 'def minimumTotal(self, triangle: list[list[int]]) -> int:\n    # implementation',
        variables: [
          {
            name: 'dp',
            description: 'memoization cache for triangle problem',
            type: 'dict'
          }
        ],
        expressions: [],
        parent: 'DP'
      }
    };

    const transformer = transformerCodeTooltipWords(tooltipMapWithDP);
    
    // This is the Coin Change II standalone code block that should NOT get 
    // tooltips for 'dp' from the minimumTotal function
    const coinChangeCode = `def change_bottom_up_1d(self, amount: int, coins: list[int]) -> int:
    dp = [1] + [0] * amount
    for coin in coins:
        for t in range(coin, amount + 1):
            dp[t] += dp[t - coin]
    return dp[amount]`;

    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, coinChangeCode, options);
      
      // BUG: This test will currently FAIL because the transformer incorrectly
      // applies tooltips for 'dp' from DP.minimumTotal to this unrelated code
      const dpDecorations = options.decorations.filter((d: any) => 
        d.properties['data-tooltip-symbol'] === 'dp' &&
        d.properties['data-tooltip-parent'] === 'DP.minimumTotal'
      );
      
      expect(dpDecorations).toHaveLength(0);
    }
  });

  it('should NOT apply nested function variable tooltips to other functions with same variable names', () => {
    // This reproduces the bug where dp variables from multiple functions 
    // all get tooltips from the one function that has a nested dp function
    const tooltipMapWithMultipleDPs: Record<string, SymbolMetadata> = {
      'DP.minimumTotal': {
        name: 'minimumTotal',
        type: 'method',
        language: 'python',
        file: 'dp.py',
        line: 3,
        signature: 'def minimumTotal(self, triangle: list[list[int]]) -> int:',
        parameters: [],
        return_type: 'int',
        return_description: 'minimum path sum',
        description: 'Find minimum path sum in triangle',
        code: 'def minimumTotal(self, triangle: list[list[int]]) -> int:\n    def dp(r, c): pass',
        variables: [],
        expressions: [],
        parent: 'DP'
      },
      'DP.minimumTotal.dp': {
        name: 'dp',
        type: 'method',
        language: 'python',
        file: 'dp.py',
        line: 22,
        signature: 'def dp(r, c):',
        parameters: [],
        return_type: '',
        return_description: '',
        description: 'Nested recursive function',
        code: 'def dp(r, c): pass',
        variables: [],
        expressions: [],
        parent: 'DP.minimumTotal'
      },
      'DP.canPartition': {
        name: 'canPartition',
        type: 'method',
        language: 'python',
        file: 'dp.py',
        line: 50,
        signature: 'def canPartition(self, nums: list[int]) -> bool:',
        parameters: [],
        return_type: 'bool',
        return_description: 'whether partition is possible',
        description: 'Check if array can be partitioned into equal sum subsets',
        code: 'def canPartition(self, nums: list[int]) -> bool:\n    dp = [True] + [False] * subset_sum',
        variables: [
          {
            name: 'dp',
            description: 'knapsack DP array for canPartition',
            type: 'list[bool]'
          }
        ],
        expressions: [],
        parent: 'DP'
      }
    };

    const transformer = transformerCodeTooltipWords(tooltipMapWithMultipleDPs);
    
    // This code contains canPartition function, so dp should get tooltips from canPartition, NOT from minimumTotal.dp
    const canPartitionCode = `def canPartition(self, nums: list[int]) -> bool:
    if (total_sum := sum(nums)) % 2 != 0:
        return False
    subset_sum = total_sum // 2
    dp = [True] + [False] * subset_sum
    for num in nums:
        for j in reversed(range(num, subset_sum + 1)):
            dp[j] = dp[j] or dp[j - num]
    return dp[subset_sum]`;

    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, canPartitionCode, options);
      
      // BUG: dp should get tooltips from DP.canPartition, NOT from DP.minimumTotal.dp
      const wrongDpDecorations = options.decorations.filter((d: any) => 
        d.properties['data-tooltip-symbol'] === 'dp' &&
        d.properties['data-tooltip-parent'] === 'DP.minimumTotal.dp'
      );
      
      const correctDpDecorations = options.decorations.filter((d: any) => 
        d.properties['data-tooltip-symbol'] === 'dp' &&
        d.properties['data-tooltip-parent'] === 'DP.canPartition'
      );
      
      // Should NOT get tooltips from the nested dp function in minimumTotal
      expect(wrongDpDecorations).toHaveLength(0);
      // Should get tooltips from the correct parent function
      expect(correctDpDecorations.length).toBeGreaterThan(0);
    }
  });

  it('should NOT treat variables as top-level functions when they share names with nested functions', () => {
    // This reproduces the ACTUAL bug: dp VARIABLE gets treated as dp FUNCTION tooltip
    const actualBugMap: Record<string, SymbolMetadata> = {
      'DP.minimumTotal.dp': {
        name: 'dp',
        type: 'method',
        language: 'python',
        file: 'dp.py',
        line: 22,
        signature: 'def dp(r, c):',
        parameters: [],
        return_type: '',
        return_description: '',
        description: 'Nested recursive function for minimumTotal',
        code: 'def dp(r, c): pass',
        variables: [],
        expressions: [],
        parent: 'DP.minimumTotal'
      }
    };

    const transformer = transformerCodeTooltipWords(actualBugMap);
    
    // This code has dp as a VARIABLE, but the current transformer incorrectly
    // treats it as the dp FUNCTION from minimumTotal
    const standaloneCode = `def canPartition(self, nums: list[int]) -> bool:
    dp = [True] + [False] * (subset_sum)
    return dp[subset_sum]`;

    const options: any = { decorations: [] };
    
    if (transformer.preprocess) {
      transformer.preprocess.call({} as any, standaloneCode, options);
      
      // BUG: dp variable should NOT get tooltips from the nested dp function
      // because this code doesn't contain minimumTotal function
      const incorrectFunctionTooltips = options.decorations.filter((d: any) => 
        d.properties['data-tooltip-symbol'] === 'dp' &&
        (d.properties['data-tooltip-type'] === 'method' || 
         d.properties['data-tooltip-parent'] === 'DP.minimumTotal.dp' ||
         d.properties['data-tooltip-parent'] === 'DP.minimumTotal')
      );
      
      // BUG: This will currently FAIL because processTopLevelSymbols incorrectly
      // treats nested functions as top-level and searches for just "dp" everywhere
      expect(incorrectFunctionTooltips).toHaveLength(0);
    }
  });

  it('should reproduce the actual bug: nested function tooltips appear everywhere', () => {
    // This test will FAIL and show the exact bug you reported
    const bugReproductionMap: Record<string, SymbolMetadata> = {
      'DP.minimumTotal.dp': {
        name: 'dp',
        type: 'method',
        language: 'python',
        file: 'dp.py',
        line: 22,
        signature: 'def dp(r, c):',
        parameters: [],
        return_type: '',
        return_description: '',
        description: 'This tooltip should NOT appear on dp variables in other functions',
        code: 'def dp(r, c): pass',
        variables: [],
        expressions: [],
        parent: 'DP.minimumTotal'
      }
    };

    const transformer = transformerCodeTooltipWords(bugReproductionMap);
    
    // This code is from a different function but contains "dp" as a variable
    const unrelatedCode = `dp = [1] + [0] * amount`;

    const options: any = { decorations: [] };
    transformer.preprocess?.call({} as any, unrelatedCode, options);
    
    // FIXED: Now no decorations should be found because nested functions
    // are not processed as top-level symbols
    const buggyTooltips = options.decorations.filter((d: any) => 
      d.properties['data-tooltip-symbol'] === 'DP.minimumTotal.dp'
    );
    
    expect(buggyTooltips).toHaveLength(0); // Now passes - bug is fixed!
  });
});