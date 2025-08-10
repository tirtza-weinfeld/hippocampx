import { revalidateTag } from "next/cache"
import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import WordsTable from "./words-table"
import AddWordForm from "./add-word-form"

type WordItem = {
  id: string | number
  word: string
  definition: string
}

type ActionResult = { ok: boolean; message?: string }

async function addWord(formData: FormData): Promise<ActionResult> {
  'use server'

  const word = String(formData.get('word') ?? '').trim()
  const definition = String(formData.get('definition') ?? '').trim()

  if (word.length < 1 || word.length > 64) return { ok: false, message: 'Word must be 1-64 chars' }
  if (definition.length < 1 || definition.length > 280) return { ok: false, message: 'Definition must be 1-280 chars' }

  const apiBase = process.env.HIPPO_API ?? process.env.NEXT_PUBLIC_HIPPO_API
  if (!apiBase) {
    console.error("HIPPO_API or NEXT_PUBLIC_HIPPO_API is not configured")
    return { ok: false, message: 'API not configured' }
  }

  const res = await fetch(`${apiBase}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, definition }),
    // Ensure no caching for mutations
    cache: 'no-store',
  })

  // Invalidate SSR cache via tag for fresh list render
  revalidateTag('hippo-words')
  return { ok: res.ok, message: res.ok ? 'Added' : 'Failed to add' }
}

async function updateWord(formData: FormData): Promise<ActionResult> {
  'use server'

  const idRaw = formData.get('id')
  const id = idRaw != null ? String(idRaw) : ''
  const originalWord = String(formData.get('originalWord') ?? '').trim()
  const word = String(formData.get('word') ?? '').trim()
  const definition = String(formData.get('definition') ?? '').trim()

  if (!id && !originalWord) return { ok: false, message: 'Missing identifier' }
  if (word.length < 1 || word.length > 64) return { ok: false, message: 'Word must be 1-64 chars' }
  if (definition.length < 1 || definition.length > 280) return { ok: false, message: 'Definition must be 1-280 chars' }

  const apiBase = process.env.HIPPO_API ?? process.env.NEXT_PUBLIC_HIPPO_API
  if (!apiBase) return { ok: false, message: 'API not configured' }

  const target = id ? `${apiBase}/words/${encodeURIComponent(id)}` : `${apiBase}/words/${encodeURIComponent(originalWord)}`
  const res = await fetch(target, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, definition }),
    cache: 'no-store',
  })

  revalidateTag('hippo-words')
  return { ok: res.ok, message: res.ok ? 'Saved' : 'Failed to save' }
}

async function deleteWord(formData: FormData): Promise<ActionResult> {
  'use server'

  const idRaw = formData.get('id')
  const id = idRaw != null ? String(idRaw) : ''
  if (!id) return { ok: false, message: 'Missing id' }
  console.log('id', id)
  const apiBase = process.env.HIPPO_API ?? process.env.NEXT_PUBLIC_HIPPO_API
  if (!apiBase) return { ok: false, message: 'API not configured' }

  // DELETE /words/{word_id} → 204
  const res = await fetch(`${apiBase}/words/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: { 'Accept': 'application/json' },
  })

  if (res.ok) {
    revalidateTag('hippo-words')
    console.log('deleteWord', id, 'deleted')
    return { ok: true, message: 'Deleted' }
  }

  let detail: string | undefined
  try {
    const data = await res.json() as { error?: string; message?: string }
    detail = data.error ?? data.message
  } catch {}
  return { ok: false, message: detail ?? `Failed to delete (${res.status})` }
}

async function getWords(): Promise<WordItem[]> {
  const apiBase = process.env.HIPPO_API ?? process.env.NEXT_PUBLIC_HIPPO_API
  if (!apiBase) return []
  try {
    const res = await fetch(`${apiBase}/words`, {
      // Always fetch fresh data so reload reflects DB changes immediately
      cache: 'no-store',
      // Keep tag in case we later switch back to caching
      next: { tags: ['hippo-words'] },
    })
    if (!res.ok) return []
    const data = (await res.json()) as unknown
    if (!Array.isArray(data)) return []
    // Accept various shapes; ensure id exists
    return (data as Array<Record<string, unknown>>)
      .map((d) => ({
        id: (d.id as string | number) ?? (d.wordId as string | number) ?? (d._id as string | number),
        word: String(d.word ?? ''),
        definition: String(d.definition ?? ''),
      }))
      .filter((w) => w.id != null && w.word)
  } catch {
    return []
  }
}

export default function Words() {
  const words = use(getWords())

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Vocabulary</CardTitle>
        <CardDescription>
          Add words and definitions. This component is a Server Component with a Server Action.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddWordForm addAction={addWord} />

        <WordsTable words={words} updateAction={updateWord} deleteAction={deleteWord} />
      </CardContent>
    </Card>
  )
}

