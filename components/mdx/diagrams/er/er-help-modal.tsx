"use client"

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

interface ERHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ERHelpModal({ open, onOpenChange }: ERHelpModalProps) {
  const shouldReduceMotion = useReducedMotion()
  const [dragConstraints] = useState({ top: -200, left: -400, right: 400, bottom: 200 })

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                className={cn(
                  'fixed left-1/2 top-1/2 z-[200]',
                  'w-full max-w-2xl max-h-[85vh]',
                  'bg-er-card border-2 border-er-border rounded-xl shadow-2xl',
                  'flex flex-col overflow-hidden',
                  'focus:outline-none'
                )}
                initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  duration: shouldReduceMotion ? 0 : undefined,
                }}
                drag
                dragConstraints={dragConstraints}
                dragElastic={0.1}
                dragMomentum={false}
              >
                <ModalHeader onClose={() => onOpenChange(false)} />
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <WhatIsERSection />
                  <TablesSection />
                  <RelationshipsSection />
                  <InteractionsSection />
                </div>
                <ModalFooter onClose={() => onOpenChange(false)} />
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-er-card-header border-b border-er-border cursor-grab active:cursor-grabbing">
      <DialogPrimitive.Title className="text-lg font-semibold text-er-text flex items-center gap-3">
        <span className="p-2 bg-er-pk rounded-lg">
          <InfoIcon />
        </span>
        Understanding ER Diagrams
      </DialogPrimitive.Title>
      <DialogPrimitive.Close asChild>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-er-text-muted hover:text-er-text hover:bg-er-border/30 rounded-lg transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </DialogPrimitive.Close>
    </header>
  )
}

function ModalFooter({ onClose }: { onClose: () => void }) {
  return (
    <footer className="px-6 py-4 bg-er-card-header border-t border-er-border">
      <button
        type="button"
        onClick={onClose}
        className="w-full px-4 py-2.5 text-sm font-medium text-er-pk bg-er-pk hover:bg-er-pk/80 rounded-lg transition-colors"
      >
        Got it!
      </button>
    </footer>
  )
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 text-er-pk" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  )
}

function WhatIsERSection() {
  return (
    <section>
      <h3 className="text-base font-semibold text-er-text mb-2">What is an ER Diagram?</h3>
      <p className="text-sm text-er-text-muted leading-relaxed">
        An <strong className="text-er-text">Entity-Relationship (ER) Diagram</strong> visually represents
        database structure: tables, columns, and relationships between them.
      </p>
    </section>
  )
}

function TablesSection() {
  return (
    <section>
      <h3 className="text-base font-semibold text-er-text mb-2">Tables (Entities)</h3>
      <div className="flex items-start gap-4 p-3 bg-er-card-header/50 rounded-lg border border-er-border">
        <TablePreview />
        <div className="space-y-2 text-sm">
          <p className="text-er-text">Each box represents a <strong>database table</strong>.</p>
          <ul className="space-y-1 text-er-text-muted">
            <KeyLegendItem color="bg-er-pk" textColor="text-er-pk" label="Primary Key (PK)" description="Unique identifier" />
            <KeyLegendItem color="bg-er-fk" textColor="text-er-fk" label="Foreign Key (FK)" description="Links to another table" />
            <KeyLegendItem color="bg-er-uk" textColor="text-er-fk" label="Unique Key (UK)" description="Unique constraint" />
          </ul>
        </div>
      </div>
    </section>
  )
}

function TablePreview() {
  return (
    <div className="shrink-0 w-36 rounded-lg border-2 border-er-border overflow-hidden bg-er-card">
      <div className="bg-er-card-header px-2 py-1.5 font-semibold text-er-text text-xs border-b border-er-border">
        users
      </div>
      <div className="text-xs">
        <div className="px-2 py-1 bg-er-pk flex items-center gap-2">
          <span className="text-er-pk font-medium">id</span>
          <span className="text-er-pk/60 ml-auto text-[10px]">PK</span>
        </div>
        <div className="px-2 py-1 text-er-text-muted">name</div>
        <div className="px-2 py-1 text-er-text-muted">email</div>
      </div>
    </div>
  )
}

function KeyLegendItem({ color, textColor, label, description }: { color: string; textColor: string; label: string; description: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded ${color} shrink-0`} />
      <span><strong className={textColor}>{label}</strong> - {description}</span>
    </li>
  )
}

function RelationshipsSection() {
  return (
    <section>
      <h3 className="text-base font-semibold text-er-text mb-2">Relationships</h3>
      <p className="text-sm text-er-text-muted mb-3">
        Lines connect foreign keys to their referenced primary keys.
      </p>
      <div className="grid gap-3">
        <RelationshipExample />
        <div className="grid grid-cols-2 gap-2">
          <SymbolLegend type="fk" label="Many (FK)" description="Arrow pointing in" />
          <SymbolLegend type="pk" label="One (PK)" description="Circle" />
        </div>
      </div>
    </section>
  )
}

function RelationshipExample() {
  return (
    <div className="p-3 bg-er-card-header/30 rounded-lg border border-er-border space-y-3">
      {/* Example 1 */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="text-xs font-medium text-er-fk bg-er-fk px-2 py-0.5 rounded">senses.entry_id</div>
          <div className="text-xs font-medium text-er-pk bg-er-pk px-2 py-0.5 rounded">lexical_entries.id</div>
        </div>
        <svg className="w-full h-6" viewBox="0 0 200 24">
          <path d="M 22 6 L 10 12 L 22 18 Z" className="fill-er-line" />
          <line x1="22" y1="12" x2="172" y2="12" className="stroke-er-line" strokeWidth="2" />
          <circle cx="180" cy="12" r="5" className="fill-er-line" />
        </svg>
      </div>
      {/* Example 2 */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="text-xs font-medium text-er-fk bg-er-fk px-2 py-0.5 rounded">word_forms.entry_id</div>
          <div className="text-xs font-medium text-er-pk bg-er-pk px-2 py-0.5 rounded">lexical_entries.id</div>
        </div>
        <svg className="w-full h-6" viewBox="0 0 200 24">
          <path d="M 22 6 L 10 12 L 22 18 Z" className="fill-er-line" />
          <line x1="22" y1="12" x2="172" y2="12" className="stroke-er-line" strokeWidth="2" />
          <circle cx="180" cy="12" r="5" className="fill-er-line" />
        </svg>
      </div>
      <p className="text-xs text-er-text-muted text-center">Many senses/word_forms → One lexical_entry</p>
    </div>
  )
}

function SymbolLegend({ type, label, description }: { type: 'fk' | 'pk'; label: string; description: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-er-card-header/20 rounded-lg">
      <svg className="w-10 h-6 shrink-0" viewBox="0 0 40 24">
        {type === 'fk' ? (
          <>
            {/* Arrow pointing in = "many" */}
            <path d="M 18 6 L 8 12 L 18 18 Z" className="fill-er-line" />
            <line x1="18" y1="12" x2="34" y2="12" className="stroke-er-line" strokeWidth="2" />
          </>
        ) : (
          <>
            {/* Circle = "one" */}
            <line x1="6" y1="12" x2="22" y2="12" className="stroke-er-line" strokeWidth="2" />
            <circle cx="28" cy="12" r="5" className="fill-er-line" />
          </>
        )}
      </svg>
      <div className="text-xs">
        <p className="font-medium text-er-text">{label}</p>
        <p className="text-er-text-muted">{description}</p>
      </div>
    </div>
  )
}

function InteractionsSection() {
  return (
    <section>
      <h3 className="text-base font-semibold text-er-text mb-2">Interactions</h3>
      {/* Desktop/mouse interactions */}
      <div className="hidden pointer-fine:grid grid-cols-2 gap-2 text-xs">
        <InteractionItem label="Drag tables" description="Reposition" />
        <InteractionItem label="Scroll on table" description="Zoom table" />
        <InteractionItem label="Scroll on canvas" description="Zoom all" />
        <InteractionItem label="Drag canvas" description="Pan view" />
        <InteractionItem label="Double-click" description="Reset view" />
        <InteractionItem label="Fullscreen" description="Expand" />
      </div>
      {/* Touch/mobile interactions */}
      <div className="grid pointer-fine:hidden grid-cols-2 gap-2 text-xs">
        <InteractionItem label="Drag tables" description="Move" />
        <InteractionItem label="Pinch on table" description="Zoom table" />
        <InteractionItem label="Pinch on canvas" description="Zoom all" />
        <InteractionItem label="Drag canvas" description="Pan view" />
        <InteractionItem label="Double-tap" description="Reset view" />
        <InteractionItem label="Fullscreen" description="Expand" />
      </div>
    </section>
  )
}

function InteractionItem({ label, description }: { label: string; description: string }) {
  return (
    <div className="p-2 bg-er-card-header/20 rounded-lg">
      <p className="font-medium text-er-text">{label}</p>
      <p className="text-er-text-muted">{description}</p>
    </div>
  )
}
