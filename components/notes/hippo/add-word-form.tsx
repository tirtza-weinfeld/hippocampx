"use client"

import { useActionState, useEffect, useRef } from "react"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type ActionResult = { ok: boolean; message?: string }

export default function AddWordForm({ addAction }: { addAction: (formData: FormData) => Promise<ActionResult> }) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_prev, formData) => addAction(formData),
    { ok: false }
  )

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset()
      if (state.message) toast.success(state.message)
    } else if (state && state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr_auto]">
      <Input name="word" placeholder="Word" aria-label="Word" required />
      <Input name="definition" placeholder="Definition" aria-label="Definition" required />
      <Button type="submit" disabled={pending}>
        <Plus className="size-4 mr-1.5" /> Add
      </Button>
    </form>
  )
}


