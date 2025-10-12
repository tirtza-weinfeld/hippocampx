'use client'

import { MascotSettingsProvider } from './mascot-settings-context'
import { MascotProvider } from './mascot-context'

/**
 * Client component that provides all mascot context.
 * This is the ONLY client boundary needed for context.
 * Render this at the layout level and pass server components as children.
 */
export function MascotProviders({ children }: { children: React.ReactNode }) {
  return (
    <MascotSettingsProvider>
      <MascotProvider>
        {children}
      </MascotProvider>
    </MascotSettingsProvider>
  )
}
