"use client"

import { motion } from "motion/react"
import React from "react"

// Animated SVG icon components for each file type
const iconBase =
    "w-8 h-8 p-1  border border-transparent transition-colors duration-300"

    const TsIcon = ({ className }: { className?: string }) => (
        <motion.svg
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            viewBox="0 0 24 24"
            className={`${iconBase} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="24" height="24" rx="6" fill="none" />
            <text
                x="12"
                y="19"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="var(--color-blue-400)"
                fontFamily="Satoshi, sans-serif"
            >
                TS
            </text>
        </motion.svg>
    )

const ReactIcon = ({ className }: { className?: string }) => (
    <motion.svg
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 24 24"
        className={`${iconBase} ${className}`}
        fill="var(--color-sky-400)"
        xmlns="http://www.w3.org/2000/svg"
    >



        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
    </motion.svg>
)

const JsonIcon = () => (
    <motion.svg
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-amber-500 dark:text-amber-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            JSON
        </text>
    </motion.svg>
)

const PyIcon = ({ className }: { className?: string }) => (
    <motion.svg
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        viewBox="0 0 24 24"
        className={`${iconBase} ${className}`}
        fill="var(--color-blue-400)"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
    >
        <title>Python</title>
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
    </motion.svg>
)

const HtmlIcon = () => (
    <motion.svg
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-orange-500 dark:text-orange-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            HTML
        </text>
    </motion.svg>
)

const CssIcon = () => (
    <motion.svg
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-sky-500 dark:text-sky-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            CSS
        </text>
    </motion.svg>
)

const ShellIcon = () => (
    <motion.svg
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-lime-600 dark:text-lime-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            SH
        </text>
    </motion.svg>
)

const BashIcon = () => (
    <motion.svg
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-green-700 dark:text-green-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            BASH
        </text>
    </motion.svg>
)

const ZshIcon = () => (
    <motion.svg
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-gray-700 dark:text-gray-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            ZSH
        </text>
    </motion.svg>
)

const SqlIcon = () => (
    <motion.svg
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-indigo-600 dark:text-indigo-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            SQL
        </text>
    </motion.svg>
)

const MdIcon = () => (
    <motion.svg
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-gray-900 dark:text-gray-100`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            MD
        </text>
    </motion.svg>
)

const MdxIcon = () => (
    <motion.svg
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-purple-600 dark:text-purple-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            MDX
        </text>
    </motion.svg>
)

const XmlIcon = () => (
    <motion.svg
        initial={{ rotate: 10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-pink-600 dark:text-pink-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            XML
        </text>
    </motion.svg>
)

const DefaultIcon = () => (
    <motion.svg
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        viewBox="0 0 32 32"
        className={`${iconBase} text-neutral-400 dark:text-neutral-600`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="#fff"
            fontFamily="Satoshi, sans-serif"
        >
            FILE
        </text>
    </motion.svg>
)

export function getFileIcon(filename: string) {
    const extension = filename.split('.').pop()?.toLowerCase() || ''
    switch (extension) {
        case 'ts':
            return <TsIcon />
        case 'tsx':
            return <ReactIcon />
        case 'json':
            return <JsonIcon />
        case 'py':
            return <PyIcon />
        case 'html':
            return <HtmlIcon />
        case 'css':
            return <CssIcon />
        case 'sh':
            return <ShellIcon />
        case 'bash':
            return <BashIcon />
        case 'zsh':
            return <ZshIcon />
        case 'sql':
            return <SqlIcon />
        case 'md':
            return <MdIcon />
        case 'mdx':
            return <MdxIcon />
        case 'xml':
            return <XmlIcon />
        default:
            return <DefaultIcon />
    }
}