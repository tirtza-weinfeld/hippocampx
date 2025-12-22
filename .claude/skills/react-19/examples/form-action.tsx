'use client'

import { useActionState, useOptimistic } from 'react'

type State = { message: string; error?: string }

async function submitForm(prev: State, formData: FormData): Promise<State> {
  const name = formData.get('name') as string
  // Server action logic here
  return { message: `Hello, ${name}!` }
}

export function GreetingForm() {
  const [state, action, isPending] = useActionState(submitForm, { message: '' })
  const [optimisticMessage, setOptimisticMessage] = useOptimistic(state.message)

  return (
    <form
      action={async (formData) => {
        setOptimisticMessage(`Hello, ${formData.get('name')}!`)
        await action(formData)
      }}
    >
      <input name="name" required />
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Greet'}
      </button>
      <p>{optimisticMessage}</p>
    </form>
  )
}
