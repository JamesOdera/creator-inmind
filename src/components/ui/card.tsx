import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({
    padding = 'md',
    className,
    ...props
}: ComponentPropsWithoutRef<'div'> & { padding?: keyof typeof paddings }) {
    return (
        <div
            className={cn('im-card rounded-3xl', paddings[padding], className)}
            {...props}
        />
    )
}
