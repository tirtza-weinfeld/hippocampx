import React from "react"

export const FLASHCARD_CONTROL_CLASSES = `bg-accent/20 p-3 rounded-full cursor-pointer hover:bg-accent/40 
text-foreground hover:text-accent transition-all h-full ease-in-out duration-500  hover:scale-101

border-1 border-transparent
`

export default function FlashcardControl(
    { children, className, onClick, ref, disabled }: { children: React.ReactNode, className?: string, onClick: () => void,
        ref?: React.Ref<HTMLButtonElement>,
        disabled?: boolean
      }) {


    return (

        <button className={`         
            ${FLASHCARD_CONTROL_CLASSES}
            ${className}
        ${disabled ? "pointer-events-none opacity-50 select-none focus:outline-none focus-" : ""}
        
      
    `}
            onClick={(e) => {
                e.stopPropagation()
                if (!disabled) {
                    onClick()
                }

            }}


            ref={ref}
        >
            {children}
        </button>
    )


}