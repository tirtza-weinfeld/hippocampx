interface SearchShortcutProps {
  keys: string[]
}

export function SearchShortcut({ keys }: SearchShortcutProps) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="rounded border bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-medium text-teal-600 ring-teal-500 focus:ring-teal-500"
        >
          {key}
        </kbd>
      ))}
    </div>
  )
}
