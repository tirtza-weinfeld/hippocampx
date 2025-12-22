---
name: react-19
description: React 19.3+ patterns. Use for forms (useActionState, useOptimistic, useFormStatus), async data (use, Suspense, cache), pre-rendering (Activity), transitions (ViewTransition), refs, context, metadata, and resource preloading.
---

# React 19.3+

## Forms

1. Define action: `async (prevState, formData) => newState`
2. Hook it up: `const [state, action, isPending] = useActionState(fn, initialState)`
3. Bind to form: `<form action={action}>`
4. For instant feedback: `const [optimistic, setOptimistic] = useOptimistic(state)`
5. For nested submit buttons: `const { pending } = useFormStatus()`

See `examples/form-action.tsx` for full pattern.

## Pre-rendering with Activity

1. Wrap content in `<Activity mode="hidden">` to render in background
2. Switch to `mode="visible"` when ready to show
3. Use for tabs, modals, or routes user will likely navigate to

See `examples/activity-prerender.tsx` for full pattern.

## Effect events

1. Extract non-reactive logic: `const onEvent = useEffectEvent(() => fn(latestValue))`
2. Call from Effect—sees current props/state without triggering re-runs
3. Do NOT add to dependency array

See `examples/effect-event.tsx` for full pattern.

## Refs

```tsx
// Pass as prop (no forwardRef needed)
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

// Cleanup function
<div ref={(el) => {
  if (el) return () => cleanup(el)
}} />
```

## Resetting state on prop change

```tsx
<UserProfile key={userId} user={user} />
```

## Reading promises and context

```tsx
const data = use(fetchPromise)      // Suspends until resolved
const theme = use(ThemeContext)     // Replaces useContext
```

## Context as provider

```tsx
<ThemeContext value="dark">{children}</ThemeContext>
```

## Suspense

```tsx
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

## ViewTransition

```tsx
<ViewTransition>{showA ? <PageA /> : <PageB />}</ViewTransition>
```

## Deferred value

```tsx
const deferred = useDeferredValue(value, initialValue)
```

## Request memoization (RSC)

```tsx
const getData = cache(async (id: string) =>
  fetch(`/api/${id}`, { signal: cacheSignal() }).then(r => r.json())
)
```

## Server Action

```tsx
async function save(formData: FormData) {
  "use server"
  await db.insert({ name: formData.get('name') })
  revalidatePath('/')
}
```

## Document metadata

```tsx
// Hoisted to <head> automatically
<title>{post.title}</title>
<meta name="description" content={post.summary} />
<link rel="canonical" href={post.url} />
```

## Resource preloading

```tsx
import { preload, preinit, prefetchDNS, preconnect } from 'react-dom'

preinit('/script.js', { as: 'script' })
preload('/font.woff2', { as: 'font', crossOrigin: 'anonymous' })
preconnect('https://api.example.com')
prefetchDNS('https://cdn.example.com')
```

## Avoid

- `forwardRef` → ref is a prop
- `useCallback` / `useMemo` → compiler handles it
- `useContext` → `use(Context)`
- `Context.Provider` → `<Context value={}>`
- `useEffect` for data fetching → `use(promise)` or Server Components
- `useEffect` to sync props to state → `key` prop
- `useState` + `onChange` for forms → `useActionState`
