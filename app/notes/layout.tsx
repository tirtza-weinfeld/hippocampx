import React from 'react'

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-none">
        {children}
      </div>
    </div>
  )
}