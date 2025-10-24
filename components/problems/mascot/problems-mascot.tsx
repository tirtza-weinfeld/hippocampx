import React from 'react'
import { MascotDialog } from './mascot-dialog'
import { MascotButton } from './mascot-button'
import { ProblemsView } from './problems-view'
import { SettingsView } from './settings-view'

/**
 * Server component that creates views and passes them to client components.
 * No data fetching here - each view fetches its own data independently.
 */
export default function ProblemsMascot() {
  // Create server component views
  const views = {
    main: <ProblemsView />,
    settings: <SettingsView />,
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <MascotDialog views={views} />
      <MascotButton />
    </div>
  )
}