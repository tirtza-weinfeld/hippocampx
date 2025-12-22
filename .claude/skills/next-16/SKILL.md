---
name: next-16
description: Next.js 16.1+ App Router patterns. Use when working with pages, routing, caching, params, or middleware.
---

# Next.js 16.1+

## Async params

Type `params` and `searchParams` as `Promise<>`, await in component body.

→ `examples/async-params.tsx`

## Caching Overview

Enable `cacheComponents: true` in next.config.ts.

| Directive | Runtime APIs | Storage | Use Case |
|-----------|-------------|---------|----------|
| `"use cache"` | No | In-memory | Static shared content |
| `"use cache: private"` | Yes | Browser only | User-specific data |
| `"use cache: remote"` | No | Remote cache | Multi-instance shared |

## `"use cache"`

Cache routes, components, or functions. Data fetching cached as part of static shell.

```tsx
async function getData() {
  'use cache'
  cacheLife('hours')
  cacheTag('my-data')
  return fetch('/api/data')
}
```

### Serialization Rules

**Supported:** primitives, plain objects, arrays, Date, Map, Set, React elements (pass-through only)

**Unsupported:** class instances, functions (except pass-through), Symbols, WeakMap/WeakSet

### Pass-Through Pattern

Accept non-serializable values without introspecting them:

```tsx
async function CachedWrapper({ children }: { children: ReactNode }) {
  'use cache'
  // DON'T read/modify children - just pass through
  return <div>{children}</div>
}
```

### Runtime API Constraint

Cannot access `cookies()`, `headers()`, `searchParams` inside cached scope. Read outside and pass as args:

```tsx
// ❌ Wrong - runtime API inside cache
async function Cached() {
  'use cache'
  const cookie = cookies().get('theme') // Error!
}

// ✅ Correct - pass as argument
async function Page() {
  const theme = (await cookies()).get('theme')
  return <Cached theme={theme} />
}
```

→ `examples/use-cache.tsx`

## `"use cache: private"`

Allows runtime APIs inside cache. Results cached in **browser memory only**, never on server.

```tsx
async function getRecommendations(productId: string) {
  'use cache: private'
  cacheLife({ stale: 60 }) // min 30s required

  const session = (await cookies()).get('session')?.value
  return getPersonalizedRecs(productId, session)
}
```

**Constraints:**
- Executes on every server render
- Excluded from static shell
- `cacheLife` stale time must be ≥30s

→ `examples/use-cache-private.tsx`

## `"use cache: remote"`

Stores output in remote cache. Durable across instances/deployments.

```tsx
async function getProductPrice(productId: string, currency: string) {
  'use cache: remote'
  cacheTag(`price-${productId}`)
  cacheLife({ expire: 3600 })
  return db.products.getPrice(productId, currency)
}
```

**Use when:**
- Rate-limited APIs
- Slow/expensive backends
- Serverless (ephemeral memory)

**Avoid when:**
- Fast operations (<50ms)
- High-cardinality cache keys
- Frequently changing data

→ `examples/use-cache-remote.tsx`

## `"use client"`

Marks client-side entry point. Add at top of file before imports.

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**Props must be serializable.** Functions cannot be passed from server to client.

## `"use server"`

Marks Server Actions. Can be file-level or inline.

```tsx
// File-level
'use server'
export async function createUser(formData: FormData) {
  await db.user.create({ data: Object.fromEntries(formData) })
  revalidatePath('/users')
}

// Inline
async function submitForm(formData: FormData) {
  'use server'
  await saveData(formData)
}
```

## Invalidation

```tsx
import { cacheTag, revalidateTag, updateTag } from 'next/cache'

// Tag cached data
async function getData() {
  'use cache'
  cacheTag('products')
  return fetch('/api/products')
}

// Invalidate
revalidateTag('products', 'hours')  // SWR-style with profile
updateTag('products')               // Server Actions: immediate
```

**Profiles:** `'hours'` (1h), `'days'` (1d), `'weeks'` (1w), `'max'` (1y)

## Cache Lifetime

```tsx
import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours')  // Profile shorthand
  // or
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 })
}
```

## Proxy (auth/routing)

Use `proxy.ts` instead of `middleware.ts`. Runs on Node.js runtime.

→ `examples/proxy.ts`

## Common Mistakes

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `'use cache'` with `cookies()` inside | Read cookies outside, pass as arg |
| Creating JSX inside cache, passing to client | Pass data to client, render there |
| `middleware.ts` | `proxy.ts` |
| `revalidateTag(tag)` | `revalidateTag(tag, 'hours')` |
| Cache high-cardinality keys | Cache low-cardinality, filter in-memory |
