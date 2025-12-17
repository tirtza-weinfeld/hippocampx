---
paths: "**/*.ts,**/*.tsx"
---
# TypeScript

## Function Declarations
```typescript
function fetchData(id: string) {
  return db.query(id)
}

async function processItems(items: Item[]) {
  return items.map(x => x.value)
}
```

## Arrow Functions (callbacks only)
```typescript
items.map(x => x.id)
items.filter(x => x.active)
items.map(x => ({ id: x.id, name: x.name }))
promise.then(data => data.result)
array.reduce((acc, x) => acc + x, 0)
```

## Const Assertions
```typescript
const CONFIG = { endpoint: '/api', methods: ['GET', 'POST'] } as const
type Method = typeof CONFIG.methods[number]
```

## Satisfies
```typescript
const routes = {
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings'
} satisfies Record<string, string>
```

## Branded Types
```typescript
declare const __brand: unique symbol
type Brand<T, B> = T & { readonly [__brand]: B }

type UserId = Brand<string, 'UserId'>
type Email = Brand<string, 'Email'>

function createUserId(value: string): UserId {
  return value as UserId
}
```

## Template Literal Types
```typescript
type EventName<T extends string> = `on${Capitalize<T>}`
type ButtonEvents = EventName<'click' | 'hover'>

type ApiPath = `/api/${string}`
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
```

## Utility Types
```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

type OptionalKeys<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] }
type RequiredKeys<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] }

type ArrayElement<T> = T extends readonly (infer U)[] ? U : never
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T
```

## Type Guards
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new Error('Invalid user')
}
```

## Result Type
```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

## Type-Only Imports
```typescript
import type { User } from './types'
import { createUser, type CreatePayload } from './service'
```

## Zod Schema
```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
})

type User = z.infer<typeof UserSchema>
```

## Namespace Organization
```typescript
namespace User {
  export type Entity = { id: string; name: string; email: string }
  export type CreatePayload = Omit<Entity, 'id'>
  export type UpdatePayload = Partial<CreatePayload>
}
```

## Import Defer
```typescript
import defer * as feature from "./module"
```
