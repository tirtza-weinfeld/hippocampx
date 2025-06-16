export default function NotesLayout({ children }: { children: React.ReactNode }) {
    return <div className="notes flex flex-col items-center justify-center min-h-screen p-4 m-4">
        <div className="w-full max-w-4xl">
            {children}
        </div>
    </div>
}