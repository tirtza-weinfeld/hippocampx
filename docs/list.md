# List Architecture


## Component System (3 unified item components)

**ListItem**: Regular blue styling (handles both ordered/unordered)
**ProblemIntuitionItem**: Yellow/amber styling (handles both ordered/unordered)  
**FeatureItem**: Special styling (handles both ordered/unordered)

**Unified Props Interface:**
```typescript
{ level: number, displayNumber?: string, children: ReactNode }
```
- If `displayNumber` provided → show number (ordered style)
- If `displayNumber` not provided → show icon (unordered style)

**Components are "dumb":** Just render based on props from plugin

## Level-based Styling

**Regular Items (blue family):**
- Level 1: sky-500 to cyan-500, icon Triangle
- Level 2: blue-500 to indigo-500, icon Circle  
- Level 3+: indigo-500 to purple-500, icon Shapes


**Intuition Items (yellow family):**
- Level 1: yellow-500 to amber-500, icon Lightbulb
- Level 2: amber-500 to orange-500, icon LampCeiling
- Level 3+: orange-500 to red-500, icon LampDesk

## Plugin System (3 plugins)

**remark-feature-list.ts** (marking plugin)
- Detects `~ feature` prefix in list items
- Strips the `~` prefix from text
- Adds `data-item-type="feature"` attribute
- Does NOT transform - only marks

**remark-section-list.ts** (marking plugin) 
- Detects lists in Problem intuition sections
- Adds `data-item-type="problem-intuition"` attribute
- Does NOT transform - only marks

**remark-list-variants.ts** (transformation plugin)
- The ONLY plugin that transforms lists to JSX
- Reads data attributes from other plugins
- Makes ALL decisions about component types, levels, numbering
- Centralized logic - "smart plugin"
- **Transformation Logic:**
  - Container: OrderedList vs UnorderedList
  - Item component based on `data-item-type`:
    - No attribute or "regular" → ListItem
    - "problem-intuition" → ProblemIntuitionItem  
    - "feature" → FeatureItem
  - Restart detection  
  - Level calculation (nesting depth)
  - Display numbering (decimal handling)
  - Text cleaning (remove number prefixes)
  - Whether to pass displayNumber prop (ordered) or not (unordered)
- **Input:** Marked lists with `data-item-type` attributes
- **Output:** JSX components with clean props
