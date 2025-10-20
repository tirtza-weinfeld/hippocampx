import { cn } from "@/lib/utils"
import { useCalloutContext } from "./callout-context"

/**
 * Renders file tabs in the dialog header.
 * Uses files from context (registered by ProblemFileList) instead of extracting from children.
 */
export function DialogFileTabs() {
    const { files, activeFile, setActiveFile } = useCalloutContext()

    if (files.length === 0) return null

    return (
        <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            {files.map((file) => {
                const isActive = activeFile === file

                return (
                    <button
                        key={file}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveFile(file)}
                        className={cn(
                            'px-3 py-1 rounded-md text-xs font-mono font-medium',
                            'transition-colors duration-150',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                            isActive
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                        )}
                        type="button"
                    >
                        {file}
                    </button>
                )
            })}
        </div>
    )
}
