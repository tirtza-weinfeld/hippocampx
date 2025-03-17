import React from "react"

export const LEARN_CONTROL_CLASSES = `bg-accent/20 px-3 py-2 rounded-full cursor-pointer hover:bg-accent/40 
text-foreground hover:text-accent transition-all ease-in-out duration-500  hover:scale-101

border-1 border-transparent
`

export default function LearnControl(
    { children, className, onClick, ref, disabled }: { children: React.ReactNode, className?: string, onClick: () => void,
        ref?: React.Ref<HTMLButtonElement>,
        disabled?: boolean
      }) {


    return (

        <button className={`         
            ${LEARN_CONTROL_CLASSES}
            ${className}
        ${disabled ? "pointer-events-none opacity-50 select-none focus:outline-none " : ""}
        
      
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