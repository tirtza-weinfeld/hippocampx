'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';


export default function CopyCode({code, className=""}: {code: string, className: string}) {


    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.button
                whileHover={{ scale: 1.07,rotate:10}}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-2 rounded-lg  transition-colors shadow-sm  cursor-pointer "
                aria-label={copied ? "Copied" : "Copy code"}
            >
                <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copy"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Copy className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>

    )
}