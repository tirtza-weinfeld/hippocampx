# VS Code-like Tooltip System Architecture

## Overview

This document outlines the architecture for implementing VS Code-like tooltips in MDX code blocks, providing interactive symbol documentation with syntax highlighting in both the main code and tooltip content.

## System Architecture

### Build-Time Processing Pipeline

```
MDX Content → Server Components → Shiki Highlighting → Tooltip Processing → Static Output
```

### Runtime Interaction Pipeline

```
User Interaction → Client Components → Tooltip Display → Syntax Highlighted Content
```

## Component Responsibilities

### 1. Extract Metadata Script (`examples/scripts/extract_metadata.py`)

**Purpose**: Extract symbol metadata from source files into standardized JSON format.

**Responsibilities**:
- Parse source files (Python, TypeScript, etc.)
- Extract function, class, and method definitions
- Generate parameter and return type information
- Output structured JSON metadata file

**Output Format**:
```json
{
  "symbolName": {
    "name": "string",
    "type": "function" | "class" | "method",
    "language": "string",
    "file": "string",
    "line": number,
    "signature": "string",
    "parameters": [...],
    "return_type": "string",
    "return_description": "string",
    "description": "string",
    "code": "string",
    "parent": "string"
  }
}
```

**Location**: `public/code_metadata.json`

### 2. Server Component (`components/mdx/code/code-block.tsx`)

**Purpose**: Handle syntax highlighting and tooltip injection in a single server component.

**Responsibilities**:
- Execute Shiki syntax highlighting with tooltip transformer
- Process highlighted JSX to replace markers with tooltip components
- Pre-render tooltip content with syntax highlighting
- Generate static HTML output

**Implementation**:
```typescript
export default async function CodeBlock({ children, className }) {
  // 1. Server component runs Shiki highlighting with tooltip markers
  const highlightedCode = await highlightCode(children, {
    lang: className,
    transformers: [transformerMetaTooltip()]
  })
  
  // 2. Server component processes markers and injects tooltip components
  const processedCode = processTooltipMarkers(highlightedCode.jsx)
  
  return (
    <div className="code-block">
      {processedCode}
    </div>
  )
}

function processTooltipMarkers(jsx) {
  // Replace elements with 'tooltip-marker' class with tooltip components
  return traverseAndReplace(jsx, (element) => {
    if (element.props?.className?.includes('tooltip-marker')) {
      const symbol = element.props['data-tooltip-symbol']
      const metadata = JSON.parse(element.props['data-tooltip-metadata'])
      
      return (
        <TooltipWrapper 
          key={symbol}
          symbol={symbol}
          metadata={metadata}
        >
          {element.props.children}
        </TooltipWrapper>
      )
    }
    return element
  })
}
```

### 3. Shiki Transformer (`components/mdx/code/transformers/meta-tooltip.ts`)

**Purpose**: Mark tooltip insertion points during syntax highlighting.

**Responsibilities**:
- Parse code content to identify symbols
- Match symbols against metadata
- Add decoration markers for tooltip positions
- Preserve syntax highlighting context

**Implementation**:
```typescript
export function transformerMetaTooltip(): ShikiTransformer {
  return {
    preprocess(code, options) {
      const symbols = findSymbolsInCode(code)
      
      symbols.forEach(symbol => {
        const metadata = findSymbolMetadata(symbol.name)
        if (!metadata) return
        
        options.decorations.push({
          start: symbol.start,
          end: symbol.end,
          properties: {
            class: ['tooltip-marker'],
            'data-tooltip-symbol': symbol.name,
            'data-tooltip-metadata': JSON.stringify(metadata)
          }
        })
      })
    }
  }
}
```

### 4. Tooltip Wrapper Component (`components/mdx/code/tooltip-wrapper.tsx`)

**Purpose**: Server-rendered tooltip container with pre-highlighted content.

**Responsibilities**:
- Wrap symbol text with tooltip functionality
- Include pre-rendered tooltip content
- Provide interaction triggers
- Maintain accessibility attributes

**Implementation**:
```typescript
export function TooltipWrapper({ symbol, metadata, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="symbol">{children}</span>
      </TooltipTrigger>
      <TooltipContent>
        <TooltipHeader symbol={symbol} metadata={metadata} />
        <TooltipSignature signature={metadata.signature} />
        <TooltipDescription description={metadata.description} />
        <TooltipCode code={metadata.code} language={metadata.language} />
      </TooltipContent>
    </Tooltip>
  )
}
```

### 5. Client Components (Interaction Layer)

**Purpose**: Handle user interactions and tooltip display logic.

**Responsibilities**:
- Manage tooltip show/hide states
- Handle keyboard navigation
- Provide smooth animations
- Ensure mobile compatibility

**Implementation**:
```typescript
'use client'
export function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <div 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <TooltipPortal>
          {content}
        </TooltipPortal>
      )}
    </div>
  )
}
```

## Data Flow

### Build-Time Flow

1. **MDX Processing**: MDX content passed to server component
2. **Server Component**: Executes Shiki highlighting with tooltip transformer
3. **Shiki Transformer**: Adds tooltip markers during highlighting
4. **Marker Processing**: Server component replaces markers with tooltip components
5. **Tooltip Rendering**: Tooltip content is pre-rendered with syntax highlighting
6. **Static Output**: Final HTML includes all tooltip functionality

### Runtime Flow

1. **User Interaction**: User hovers/clicks on symbol
2. **State Management**: Client component manages tooltip visibility
3. **Content Display**: Pre-rendered tooltip content is displayed
4. **Accessibility**: Keyboard navigation and screen reader support

## Performance Optimizations

### Build-Time Optimizations

- **Caching**: Highlighted code cached by content hash
- **Parallel Processing**: Multiple code blocks processed concurrently
- **Lazy Loading**: Metadata loaded only when needed
- **Tree Shaking**: Unused tooltip components excluded from bundle

### Runtime Optimizations

- **Pre-rendered Content**: No runtime syntax highlighting
- **Minimal JavaScript**: CSS-first approach where possible
- **Efficient State Management**: React hooks optimized for performance
- **Memory Management**: Tooltip content garbage collected when hidden

## Accessibility Features

- **Keyboard Navigation**: Tab, Enter, Escape key support
- **Screen Reader**: ARIA labels and descriptions
- **Focus Management**: Proper focus trapping and restoration
- **High Contrast**: Support for high contrast themes
- **Reduced Motion**: Respect user motion preferences

## Error Handling

### Graceful Degradation

- **Missing Metadata**: Symbols without metadata render without tooltips
- **Highlighting Failures**: Fallback to plain text with tooltip functionality
- **Network Issues**: Offline support for pre-rendered content
- **Browser Compatibility**: Progressive enhancement for older browsers

### Error Boundaries

- **Component Errors**: Isolated error boundaries prevent full page crashes
- **Metadata Errors**: Invalid JSON handled gracefully
- **Syntax Errors**: Malformed code processed safely

## Configuration

### Build Configuration

```typescript
// next.config.ts
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkCodeImport,  // Import code from files
    ],
    rehypePlugins: [
      rehypeMdxCodeProps, // Code properties
    ],
  },
})
```

### Component Configuration

```typescript
// mdx-components.tsx
export const customComponents = {
  code: ({ children, className, ...props }) => {
    if (className?.includes('language-')) {
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>
    }
    return <InlineCode {...props}>{children}</InlineCode>
  },
}
```

## Testing Strategy

### Unit Tests

- **Transformer Tests**: Verify tooltip marker placement
- **Component Tests**: Test tooltip rendering and interactions
- **Metadata Tests**: Validate metadata extraction and parsing
- **Accessibility Tests**: Ensure ARIA compliance

### Integration Tests

- **End-to-End**: Complete tooltip workflow testing
- **Performance Tests**: Measure rendering and interaction performance
- **Cross-Browser Tests**: Ensure compatibility across browsers
- **Mobile Tests**: Verify touch interaction support

## Deployment Considerations

### Build Optimization

- **Static Generation**: All tooltip content pre-rendered at build time
- **Bundle Analysis**: Monitor JavaScript bundle size impact
- **Caching Strategy**: Implement appropriate cache headers
- **CDN Distribution**: Serve static assets from CDN

### Monitoring

- **Performance Metrics**: Track tooltip load times and interactions
- **Error Tracking**: Monitor tooltip-related errors
- **Usage Analytics**: Track tooltip usage patterns
- **Accessibility Audits**: Regular accessibility compliance checks

## Future Enhancements

### Planned Features

- **Multi-language Support**: Tooltips in different languages
- **Code Navigation**: Jump to definition functionality
- **Refactoring Tools**: In-place code editing capabilities
- **AI Integration**: Smart code suggestions and explanations

### Performance Improvements

- **Web Workers**: Background metadata processing
- **Service Workers**: Offline tooltip caching
- **Intersection Observer**: Lazy loading on scroll
- **Request Idle Callback**: Background processing optimization

This architecture provides a robust, performant, and accessible foundation for VS Code-like tooltips while maintaining clear separation of concerns and optimal build-time processing. 