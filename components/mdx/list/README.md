# MDX List Architecture

## Overview

The list system supports **flexible combinations** of list types and item types. Any list type can contain any item type, allowing for maximum flexibility in content structure.

## Architecture

### List Types (Structure & Layout)
Determine the overall list structure and numbering/bullet behavior:

- **`OrderedList`** - Numbered lists (`1.`, `2.`, `3.`, etc.)
- **`UnorderedList`** - Bulleted lists (`"`, `-`, etc.)

### Item Types (Content & Styling)
Determine individual item appearance and behavior:

- **`RegularItem`** - Standard list item
- **`FeatureItem`** - Special feature item with enhanced styling (triggered by `~ `)
- **`TodoItem`** - Checkbox todo item (triggered by `[ ]` or `[x]`)
- **`TimelineItem`** - Timeline-style item with date/event styling
- **`DefinitionItem`** - Definition list item for glossary-style content

## Supported Combinations

All combinations of list types and item types are supported:

### Ordered Lists
```markdown
1. Regular ordered item
2. ~ Feature item in ordered list
3. [ ] Todo item in ordered list
4. [x] Completed todo in ordered list
```

### Unordered Lists
```markdown
- Regular unordered item
- ~ Feature item in unordered list
- [ ] Todo item in unordered list
- [x] Completed todo in unordered list
```

## Markdown Syntax Detection

The remark plugin (`plugins/remark-list-variants.ts`) detects item types based on content patterns:

| Pattern | Item Type | Example |
|---------|-----------|---------|
| `- regular text` | `RegularItem` | `- This is a regular item` |
| `- ~ feature text` | `FeatureItem` | `- ~ This is a feature` |
| `- [ ] todo text` | `TodoItem` | `- [ ] This is a todo` |
| `- [x] done text` | `TodoItem` (completed) | `- [x] This is done` |
| `1. regular text` | `RegularItem` | `1. Regular numbered item` |
| `1. ~ feature text` | `FeatureItem` | `1. ~ Numbered feature` |
| `1. [ ] todo text` | `TodoItem` | `1. [ ] Numbered todo` |

## Component Responsibilities

### List Components
- **Structure**: Handle list-level styling, spacing, animation containers
- **Numbering**: Manage numbering systems (1,2,3 vs a,b,c vs i,ii,iii)
- **Nesting**: Handle nested list indentation and hierarchy

### Item Components  
- **Content**: Handle item-specific content rendering
- **Styling**: Apply item-specific visual styling (colors, icons, etc.)
- **Interaction**: Handle item-specific interactions (checkbox toggles, etc.)
- **Animation**: Apply item-level animations and transitions

## Plugin Processing

The remark plugin processes lists in this order:

1. **Detect List Type**: Determine if list is ordered (`1.`) or unordered (`-`)
2. **Analyze Items**: Examine each item's content for special patterns
3. **Transform AST**: Convert to appropriate component combination
4. **Preserve Structure**: Maintain nested lists and hierarchy

Example transformation:
```markdown
1. Regular step
2. ~ Key feature step  
3. [ ] Todo step
```

Becomes:
```jsx
<OrderedList>
  <RegularItem>Regular step</RegularItem>
  <FeatureItem>Key feature step</FeatureItem>
  <TodoItem>Todo step</TodoItem>
</OrderedList>
```

## Benefits

- **Flexibility**: Mix different item types within any list type
- **Consistency**: Unified styling system across list types
- **Extensibility**: Easy to add new item types without new list types
- **Semantic**: Content meaning preserved in component structure
- **Maintainable**: Clear separation of list structure vs item styling

## Future Extensions

Possible future item types:
- **`PriorityItem`** - Items with priority levels (!! high, ! medium)
- **`ProgressItem`** - Items with progress indicators (75% complete)
- **`LinkItem`** - Items that are primarily links with special styling
- **`CodeItem`** - Items containing code snippets with syntax highlighting