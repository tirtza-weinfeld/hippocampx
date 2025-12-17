---
paths: "**/*.tsx"
---
# React + Compiler

## Server Component
```tsx
async function Page({ id }: { id: string }) {
  const data = await db.find(id)
  return <><title>{data.name}</title><Content data={data} /></>
}
```

## Client Component
```tsx
"use client"
function Toggle() {
  const [open, setOpen] = useState(false)
  return <button onClick={() => setOpen(!open)}>{open && <Panel />}</button>
}
```

## Server Action
```tsx
async function submit(fd: FormData) {
  "use server"
  await db.insert({ name: fd.get('name') })
  revalidatePath('/')
}
```

## cache + cacheSignal
```tsx
const getData = cache(async (id: string) =>
  fetch(`/api/${id}`, { signal: cacheSignal() }).then(r => r.json())
)
```

## useActionState + useFormStatus
```tsx
"use client"
function Form({ action }) {
  const [state, formAction] = useActionState(action, null)
  return <form action={formAction}><input name="x" /><Submit /></form>
}
function Submit() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? '...' : 'Go'}</button>
}
```

## useOptimistic
```tsx
const [optimistic, add] = useOptimistic(items, (s, n) => [...s, n])
```

## use
```tsx
const data = use(promise)
const ctx = use(Context)
```

## useEffectEvent
```tsx
const onEvent = useEffectEvent(() => doSomething(latestValue))
useEffect(() => { subscribe(onEvent); return unsubscribe }, [dep])
```

## useDeferredValue
```tsx
const deferred = useDeferredValue(query)
```

## useSyncExternalStore
```tsx
const snap = useSyncExternalStore(store.subscribe, store.getSnapshot)
```

## useReducer
```tsx
const [state, dispatch] = useReducer(reducer, initial)
```

## Suspense
```tsx
<Suspense fallback={<Skeleton />}><Async /></Suspense>
```

## Activity
```tsx
<Activity mode={active ? 'visible' : 'hidden'}><Tab /></Activity>
```

## ViewTransition
```tsx
<ViewTransition>{page === 'a' ? <A /> : <B />}</ViewTransition>
```

## Context
```tsx
const Ctx = createContext<T>(default)
<Ctx value={val}>{children}</Ctx>
const v = use(Ctx)
```

## Refs
```tsx
function Input({ ref }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} />
}
const cb = useCallback((el) => { if (el) return () => cleanup() }, [])
```

## Fragment Ref
```tsx
<Fragment ref={ref}>{items.map(i => <div key={i.id} />)}</Fragment>
```

## Metadata
```tsx
<><title>{t}</title><meta name="description" content={d} /></>
```

## Preload
```tsx
preload('/api/x', { as: 'fetch' })
preinit('/style.css', { as: 'style' })
```

## Serializable Props
```tsx
<Client data={{}} promise={fetch()} action={serverFn}><Server /></Client>
```
