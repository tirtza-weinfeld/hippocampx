// import HoverTooltipOverlay from "@/components/tooltip-overlay";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
    return (
    <div className="notes flex flex-col items-center justify-center min-h-screen p-4 m-4">
        <div className="w-full max-w-4xl">
            {children}
            {/* <HoverTooltipOverlay /> */}

        </div>
    </div>
    )
}