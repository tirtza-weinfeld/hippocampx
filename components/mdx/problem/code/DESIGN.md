# Professional Code Tooltip System - Architecture Document

## Overview

This document outlines the core architecture for a professional tooltip system for the problems pipeline. This system learns from the **buggy existing notes tooltip implementation** and provides a **clean, focused approach** using the redesigned `symbol_tags.json` metadata. if needed also `lsp_index.json` ..

**Critical Context**: The existing notes tooltip system has significant bugs in complex scope detection, function boundary parsing, and symbol relationships. This new system explicitly avoids those architectural pitfalls.

## Goals

### Primary Goals
- **Professional UI/UX**: VSCode-style tooltips with intelligent positioning
- **Educational Focus**: Display rich metadata from `symbol_tags.json` (difficulty, topics, LeetCode links)
- **Zero Bugs**: Learn from notes pipeline failures, avoid complex logic
- **VSCode-Level Symbols**: Handle functions, methods, classes, variables, parameters

### Non-Goals
- Supporting the existing buggy notes tooltip system (completely separate)
- Backwards compatibility with old `code_metadata.json` format
- Complex scope detection or function boundary parsing (major bug source)
- Expression handling (skip for reliability)

## Data Architecture

### Symbol Tags Structure Analysis

**Actual `symbol_tags.json` structure (redesigned):**
```json
{
  "network_delay_time:network_delay_time": {
    "args": {
      "k": {"label": "int", "documentation": "starting node"},
      "times": {"label": "list[list[int]]", "documentation": "edges and weights"}
    },
    "definition": "Given n nodes labeled 1 through n...",
    "difficulty": "medium",
    "leetcode": "[743. Network Delay Time](...)",
    "topics": ["Dijkstra"],
    "time_complexity": "O(E log V)"
  },
  "binary_tree_maximum_path_sum:binary_tree_maximum_path_sum.dfs": {
    "variables": {
      "l": "left gain",
      "r": "right gain"
    }
  }
}
```

**Critical advantages over old `code_metadata.json`:**
- **Flat key structure**: No complex parent/child relationships to parse
- **Educational focus**: Difficulty, topics, intuition, LeetCode links built-in
- **Display-ready content**: No complex processing needed
- **No file/line complexity**: Eliminates buggy function boundary detection

### Symbol Types Supported (VSCode-Level Basics)
1. **Functions**: Main problem functions (`network_delay_time`)
2. **Methods**: Nested methods (`dfs` from `binary_tree_maximum_path_sum.dfs`)
3. **Classes**: Class definitions (`LRUCache`)
4. **Variables**: Local variables with explanations (`l: "left gain"`)
5. **Arguments/Parameters**: Function parameters via `args` metadata

**Explicitly Excluded**: 
- L **Expressions**: Complex multi-token expressions (major complexity/bug source)
- L **Operators**: Individual operators or symbols

## Core Architecture

### Lessons Learned from Buggy Notes Pipeline

**What NOT to Do (Major Bug Sources):**
- L `buildFunctionScopes()` - Complex function boundary detection via regex
- L `findFunctionInCode()` - Fragile regex-based function parsing  
- L Parent/child symbol relationships - Causes scope confusion
- L Complex scope boundary calculations - Wrong start/end positions

**What TO Keep (Proven Patterns):**
-  `findWholeWordOccurrences()` - Simple, reliable string matching
-  `preprocess` + decorations pattern - Works with Shiki transformers
-  Data attributes approach - Clean separation of data and UI

### 1. Symbol Transformer - The Heart of the System

**Exact Job**: During Shiki highlighting, detect basic symbols and add data attributes

```
Input: Code string + symbol_tags.json lookup
Process: findWholeWordOccurrences("network_delay_time")
Output: Enhanced tokens with data-symbol="network_delay_time:network_delay_time"
```

**What it handles:**
- **Function names**: `network_delay_time` � `"network_delay_time:network_delay_time"`
- **Method names**: `dfs` � `"binary_tree_maximum_path_sum:binary_tree_maximum_path_sum.dfs"`  
- **Class names**: `LRUCache` � `"lru_cache:LRUCache"`
- **Variable names**: `l`, `r` � lookup in `variables` section
- **Parameters**: `times`, `k` � lookup in `args` section

**What it does NOT do:**
- L No scope detection or function boundaries
- L No expressions (`best = max(...)`) 
- L No complex parsing - just simple string matching using proven `findWholeWordOccurrences`

### 2. Essential Components

#### Symbol Data Loader
- Load symbol_tags.json at build time
- Simple key�data lookup (`"network_delay_time:network_delay_time"` � symbol data)
- No complex processing required

#### Enhanced Code Block (Server Component)  
- Takes transformer-enhanced tokens
- Wraps symbols with popover components
- Pre-renders everything server-side

#### Professional Popover Component
- Displays symbol_tags.json data (difficulty, topics, LeetCode links)
- Intelligent positioning and collision avoidance
- Professional desktop/mobile interactions

### 3. Data Flow

```
Code Input � Simple Symbol Transformer � Enhanced Tokens � Server Component � Professional Popovers
```

**Build Time:**
1. Load symbol_tags.json
2. Run simple transformer during Shiki highlighting
3. Add data-symbol attributes to matching tokens
4. Server component wraps enhanced tokens with popover components

**Runtime:**
- Minimal JavaScript for hover/tap interactions
- All tooltip content pre-rendered
- No DOM manipulation or complex client logic

### 4. Key Architectural Questions

1. **Transformer Integration**: How does this plug into existing Shiki transformer pipeline?
   - Follow existing `transformerCodeTooltipWords` pattern
   - Use `preprocess` + decorations approach
   - Add to transformer array in code-highlighter.ts

2. **Data Flow**: How do we pass symbol_tags.json data to the transformer?
   - Load at build time similar to existing `getTooltipContent()`
   - Pass as parameter to transformer factory function

3. **Server Processing**: How does the server component process enhanced tokens?
   - Scan for `data-symbol` attributes in highlighted HTML
   - Wrap matching elements with popover components
   - Preserve existing syntax highlighting

4. **Symbol Matching**: How do we handle symbol context (which `dfs` method)?
   - Start simple: exact key matching only
   - Future: context-aware matching using problem ID

## Implementation Strategy

### Phase 1: Ultra-Simple Foundation
- Basic transformer using only `findWholeWordOccurrences`
- Function and variable matching only
- Simple popover component
- No complex features

### Phase 2: Professional Polish  
- Intelligent popover positioning
- Educational content formatting
- Mobile/desktop interactions
- Performance optimization

### Phase 3: Enhanced Symbol Support
- Method and class support
- Context-aware symbol resolution
- Advanced tooltip features

## Success Criteria

- **Zero bugs**: No complex logic that can break
- **VSCode-level UX**: Professional tooltip experience
- **Educational value**: Rich metadata display
- **Performance**: Fast build times, smooth interactions
- **Maintainable**: Simple, understandable architecture