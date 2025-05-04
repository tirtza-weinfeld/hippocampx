

export default function NotesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <h1>Notes</h1>
            <div className="max-w-[60ch] mx-auto w-full space-y-6">
                {children}

            </div>
        </div>
    )
}