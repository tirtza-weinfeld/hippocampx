interface SearchShortcutProps {
  keys: string[]
}

export function SearchShortcut({ keys }: SearchShortcutProps) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm"
        >
          {key}
        </kbd>
      ))}
    </div>
  )
}
