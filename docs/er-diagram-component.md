# ERDiagram Component

## What

Custom MDX component that renders interactive database ER diagrams.

## Why

- Visualize database schemas in documentation
- Match site's design system (dark/light mode)
- No external dependencies (Mermaid is 480KB)
- Cleaner syntax than Mermaid
- Interactive exploration (hover, click, pan, zoom)

## Requirements

1. **Syntax**: SQL-like, FK inline with target table
2. **Relationships**: Auto-inferred from FK definitions
3. **Rendering**: HTML/CSS tables + SVG lines
4. **Styling**: CSS variables via `@theme inline`, dark mode support
5. **Layout**: Auto-arranged tables with relationship lines
6. **Interactivity**: Hover highlights, click for details, pan/zoom

## Input

```erDiagram
users
  id       int  PK
  name     varchar
  email    varchar  UK

posts
  id       int  PK
  user_id  int  FK(users.id)
  title    varchar
  content  text
```

## Output

Interactive diagram with:
- Tables as styled HTML elements
- PK/FK/UK constraint badges
- SVG lines connecting FK columns to referenced tables
- Hover: highlight table + its relationships
- Click: expand column details/tooltips
- Pan/zoom for large schemas

---

## Architecture

### Plugin (Build Time)

`plugins/remark-er-diagram.ts`
- Find `erDiagram` code blocks
- Parse syntax → `ERSchema`
- Replace with `<ERDiagram schema={...} />`

### Components (Runtime)

```
components/mdx/diagrams/er/
├── types.ts              # Shared types
├── er-diagram.tsx        # Main component (client)
├── er-table.tsx          # Single table card
├── er-column.tsx         # Column row with badges
├── er-relationship.tsx   # SVG line with crow's foot
├── er-canvas.tsx         # Pan/zoom container
└── use-er-layout.ts      # Layout calculation hook
```

### Styles

`styles/components/er-diagram.css`
- CSS tokens via `@theme inline`
- `:root` and `.dark` variables
- No hardcoded colors

---

## Component Breakdown

### `ERDiagram` (main)
- Receives parsed schema
- Manages hover/selection state
- Renders canvas with tables + relationships

### `ERCanvas`
- Pan/zoom container
- Mouse drag to pan
- Wheel to zoom
- Touch support

### `ERTable`
- Table card with header + columns
- Highlight state on hover
- Click to select/expand

### `ERColumn`
- Column row: name, type, constraints
- PK/FK/UK badges
- FK columns clickable (navigate to referenced table)

### `ERRelationship`
- SVG path between tables
- Crow's foot notation at ends
- Highlight on hover

### `useERLayout`
- Calculate table positions (grid or force-directed)
- Calculate relationship paths
- Responsive to container size

---

## Styling Tokens

```css
--color-er-surface        /* table background */
--color-er-header         /* table header */
--color-er-border         /* table border */
--color-er-text           /* column text */
--color-er-text-muted     /* type text */
--color-er-pk             /* primary key badge */
--color-er-fk             /* foreign key badge */
--color-er-uk             /* unique badge */
--color-er-line           /* relationship line */
--color-er-line-hover     /* highlighted line */
```

---

## Interactions

| Action | Result |
|--------|--------|
| Hover table | Highlight table + connected lines |
| Hover FK badge | Highlight target table |
| Click table | Select, show details panel |
| Click FK | Pan to referenced table |
| Drag canvas | Pan |
| Scroll/pinch | Zoom |
| Double-click | Reset view |
