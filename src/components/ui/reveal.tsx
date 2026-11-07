'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Reveal({
    children,
    className,
    delay = 0,
}: {
    children: ReactNode
    className?: string
    delay?: number
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    )
}
