'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function CopyCode({code, className=""}: {code: string, className: string}) {

    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.07, translateY: -5}}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        className="p-2 rounded-lg  transition-colors shadow-sm  cursor-pointer "
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
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {copied ? "Copied!" : "Copy code"}
                </TooltipContent>
            </Tooltip>
        </div>

    )
}