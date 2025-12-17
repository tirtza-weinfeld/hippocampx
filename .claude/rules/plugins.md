---
paths: "plugins/**,lib/plugins/**,**/*plugin*.ts"
---
# Plugin Patterns

## Remark Plugin (mdast)

```typescript
import type { Plugin } from 'unified'
import type { Root, Code } from 'mdast'
import { visit } from 'unist-util-visit'

interface Options {
  readonly className?: string
}

export const remarkPlugin: Plugin<[Options?], Root> = (options = {}) => (tree) => {
  visit(tree, 'code', (node: Code, index, parent) => {
    if (!parent || index === null) return
    node.data = { ...node.data, hProperties: { className: options.className } }
  })
}
```

## Rehype Plugin (hast)

```typescript
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

export const rehypePlugin: Plugin<[Options?], Root> = (options = {}) => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'pre') {
      node.properties = { ...node.properties, className: options.className }
    }
  })
}
```

## Recma Plugin (estree)

```typescript
import type { Plugin } from 'unified'
import type { Program } from 'estree'
import { walk } from 'estree-walker'

export const recmaPlugin: Plugin<[Options?], Program> = (options = {}) => (tree) => {
  walk(tree, {
    enter(node) {
      if (node.type === 'ExportNamedDeclaration') {
        // transform estree node
      }
    }
  })
}
```

## Async Plugin

```typescript
export const asyncPlugin: Plugin<[], Root> = () => async (tree) => {
  const tasks: Promise<void>[] = []
  visit(tree, 'code', (node: Code) => tasks.push(highlight(node)))
  await Promise.allSettled(tasks)
}
```

## Plugin with VFile

```typescript
import type { VFile } from 'vfile'

export const pluginWithFile: Plugin<[], Root> = () => (tree, file: VFile) => {
  file.data.meta = { processed: true }
  visit(tree, 'code', (node: Code) => {
    file.message('Found code block', node.position)
  })
}
```

## Turbopack-Compatible Plugin

```typescript
// Options must be JSON-serializable (no functions)
export interface Options {
  className: string
  enabled: boolean
  themes: string[]
}

export default function remarkCustom(options: Options) {
  return (tree: Root) => {
    if (!options.enabled) return
    visit(tree, 'code', (node: Code) => {
      node.data = { ...node.data, className: options.className }
    })
  }
}
```

## Plugin Composition

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  .use(remarkParse)
  .use(remarkPlugin, { className: 'code' })
  .use(remarkRehype)
  .use(rehypePlugin)
  .use(rehypeStringify)

const result = await processor.process(markdown)
```

## Plugin Error

```typescript
class PluginError extends Error {
  constructor(message: string, options?: ErrorOptions & { node?: string }) {
    super(message, options)
    this.name = 'PluginError'
  }
}

throw new PluginError('Transform failed', { cause: error, node: node.type })
```
